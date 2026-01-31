# Sprint 10: Polish & Notifications

**Theme**: Production ready
**Duration**: 1 week

---

## Objective

Get the app production-ready with push notifications, settings management, UI polish, and robust error handling. After this sprint, the app should feel complete and stable enough for real users.

---

## Prerequisites

- Sprint 9 complete (all features functional)
- Apple Push Notification service (APNs) certificate
- App running on test devices

---

## Deliverables

### 1. Push Notification Registration

**Notification Manager:**

```swift
// Core/Notifications/NotificationManager.swift
import UserNotifications
import UIKit

@MainActor
class NotificationManager: ObservableObject {
    @Published var isAuthorized = false
    @Published var authorizationStatus: UNAuthorizationStatus = .notDetermined

    static let shared = NotificationManager()

    func requestPermission() async {
        do {
            let granted = try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .sound, .badge])

            isAuthorized = granted

            if granted {
                await registerForPushNotifications()
            }
        } catch {
            print("Notification permission error: \(error)")
        }
    }

    func checkCurrentStatus() async {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        authorizationStatus = settings.authorizationStatus
        isAuthorized = settings.authorizationStatus == .authorized
    }

    private func registerForPushNotifications() async {
        await MainActor.run {
            UIApplication.shared.registerForRemoteNotifications()
        }
    }

    func handleDeviceToken(_ token: Data) {
        let tokenString = token.map { String(format: "%02.2hhx", $0) }.joined()
        Task {
            try? await PushService.shared.registerToken(tokenString)
        }
    }

    func handleRegistrationError(_ error: Error) {
        print("Push registration failed: \(error)")
    }
}

// In AppDelegate or App struct
class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        NotificationManager.shared.handleDeviceToken(deviceToken)
    }

    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        NotificationManager.shared.handleRegistrationError(error)
    }
}
```

**Push Service (Backend):**

```typescript
// lib/push-service.ts
import { supabase } from './supabase'

// Table for device tokens
// CREATE TABLE push_tokens (
//   id uuid default gen_random_uuid() primary key,
//   user_id uuid references profiles on delete cascade not null,
//   token text not null,
//   platform text default 'ios',
//   created_at timestamptz default now(),
//   unique(user_id, token)
// );

export async function registerPushToken(userId: string, token: string) {
  const { error } = await supabase
    .from('push_tokens')
    .upsert({
      user_id: userId,
      token: token,
      platform: 'ios'
    })

  if (error) throw error
}

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, any>
) {
  const { data: tokens } = await supabase
    .from('push_tokens')
    .select('token')
    .eq('user_id', userId)

  if (!tokens?.length) return

  // Send via APNs (or use a service like OneSignal/Firebase)
  for (const { token } of tokens) {
    await sendAPNs(token, { title, body, data })
  }
}
```

### 2. Vera-Initiated Check-In Notifications

**Check-In Scheduler:**

```typescript
// lib/check-in-scheduler.ts

export interface CheckInSchedule {
  type: 'milestone' | 'daily' | 'craving_check' | 'encouragement'
  hour: number       // Hour of day (user's timezone)
  message: string
  conditions?: (userId: string) => Promise<boolean>
}

// Scheduled check-ins
export const CHECK_IN_SCHEDULES: CheckInSchedule[] = [
  {
    type: 'daily',
    hour: 9,
    message: "Good morning. How are you feeling today?"
  },
  {
    type: 'craving_check',
    hour: 14,
    message: "Afternoon check-in. How's the day going?"
  },
  {
    type: 'encouragement',
    hour: 20,
    message: "You made it through another day. That's not nothing."
  }
]

// Milestone notification messages
export const MILESTONE_NOTIFICATIONS: Record<string, { title: string; body: string }> = {
  '20_minutes': {
    title: '20 minutes smoke-free',
    body: 'Your heart rate is already normalising. This is real.'
  },
  '8_hours': {
    title: '8 hours smoke-free',
    body: 'Carbon monoxide is clearing from your blood. Keep going.'
  },
  '24_hours': {
    title: '24 hours smoke-free!',
    body: 'One full day. Your heart attack risk is already dropping.'
  },
  '48_hours': {
    title: '48 hours smoke-free!',
    body: 'Your taste buds are waking up. Notice anything?'
  },
  '72_hours': {
    title: '72 hours — NICOTINE FREE',
    body: 'The nicotine is OUT of your body. Everything from here is psychological. You can do this.'
  },
  '1_week': {
    title: 'ONE WEEK!',
    body: '7 days. 168 hours. Your lungs are healing right now.'
  },
  '1_month': {
    title: 'ONE MONTH SMOKE-FREE',
    body: '30 days. Your lung function has improved up to 30%. You did this.'
  }
}

// Cron job to check and send notifications
export async function processScheduledNotifications() {
  const { data: activeUsers } = await supabase
    .from('quit_attempts')
    .select('user_id, started_at')
    .eq('is_active', true)

  if (!activeUsers) return

  for (const user of activeUsers) {
    const stats = await getProgressStats(user.user_id)

    // Check for new milestones
    const newMilestones = await checkMilestones(user.user_id, stats)

    for (const milestone of newMilestones) {
      const notification = MILESTONE_NOTIFICATIONS[milestone.key]
      if (notification) {
        await sendPushNotification(
          user.user_id,
          notification.title,
          notification.body,
          { type: 'milestone', key: milestone.key }
        )

        // Mark as notified
        await supabase
          .from('milestones')
          .update({ notified: true })
          .eq('user_id', user.user_id)
          .eq('milestone_key', milestone.key)
      }
    }
  }
}
```

**Notification Handling on iOS:**

```swift
// Core/Notifications/NotificationHandler.swift
import UserNotifications

class NotificationHandler: NSObject, UNUserNotificationCenterDelegate {
    // Handle notification when app is in foreground
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound])
    }

    // Handle notification tap
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo

        if let type = userInfo["type"] as? String {
            switch type {
            case "milestone":
                NavigationRouter.shared.navigate(to: .progress)
            case "check_in":
                NavigationRouter.shared.navigate(to: .chat)
            default:
                break
            }
        }

        completionHandler()
    }
}

// Simple navigation router
class NavigationRouter: ObservableObject {
    static let shared = NavigationRouter()
    @Published var selectedTab: AppTab = .chat

    enum AppTab {
        case chat
        case progress
        case settings
    }

    func navigate(to tab: AppTab) {
        DispatchQueue.main.async {
            self.selectedTab = tab
        }
    }
}
```

### 3. Settings Screen

```swift
// Features/Settings/Views/SettingsView.swift
import SwiftUI

struct SettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        NavigationStack {
            ZStack {
                Color.rebelBlack.ignoresSafeArea()

                List {
                    // Notification Preferences
                    Section {
                        Toggle("Daily Check-ins", isOn: $viewModel.dailyCheckIns)
                            .tint(.electricCoral)

                        Toggle("Milestone Alerts", isOn: $viewModel.milestoneAlerts)
                            .tint(.electricCoral)

                        Toggle("Encouragement", isOn: $viewModel.encouragementNotifs)
                            .tint(.electricCoral)

                        if viewModel.dailyCheckIns {
                            DatePicker(
                                "Check-in Time",
                                selection: $viewModel.checkInTime,
                                displayedComponents: .hourAndMinute
                            )
                        }
                    } header: {
                        Text("NOTIFICATIONS")
                            .font(.custom("SpaceGrotesk-Medium", size: 12))
                            .foregroundColor(.signalWhite.opacity(0.5))
                    }

                    // Smoking Profile
                    Section {
                        NavigationLink {
                            EditSmokingProfileView(viewModel: viewModel)
                        } label: {
                            SettingsRow(icon: "flame.fill", title: "Smoking Profile", value: "\(viewModel.cigarettesPerDay)/day")
                        }

                        NavigationLink {
                            EditQuitDateView(viewModel: viewModel)
                        } label: {
                            SettingsRow(icon: "calendar", title: "Quit Date", value: viewModel.quitDateFormatted)
                        }
                    } header: {
                        Text("YOUR PROFILE")
                            .font(.custom("SpaceGrotesk-Medium", size: 12))
                            .foregroundColor(.signalWhite.opacity(0.5))
                    }

                    // Account
                    Section {
                        SettingsRow(icon: "person.fill", title: "Account", value: viewModel.email)

                        NavigationLink {
                            PrivacyPolicyView()
                        } label: {
                            SettingsRow(icon: "lock.fill", title: "Privacy Policy", value: "")
                        }

                        NavigationLink {
                            TermsView()
                        } label: {
                            SettingsRow(icon: "doc.text", title: "Terms of Service", value: "")
                        }
                    } header: {
                        Text("ACCOUNT")
                            .font(.custom("SpaceGrotesk-Medium", size: 12))
                            .foregroundColor(.signalWhite.opacity(0.5))
                    }

                    // Danger zone
                    Section {
                        Button {
                            viewModel.showingResetConfirmation = true
                        } label: {
                            HStack {
                                Image(systemName: "arrow.counterclockwise")
                                Text("Reset Progress")
                            }
                            .foregroundColor(.softEmber)
                        }

                        Button {
                            authManager.signOut()
                        } label: {
                            HStack {
                                Image(systemName: "rectangle.portrait.and.arrow.right")
                                Text("Sign Out")
                            }
                            .foregroundColor(.signalWhite)
                        }

                        Button {
                            viewModel.showingDeleteConfirmation = true
                        } label: {
                            HStack {
                                Image(systemName: "trash")
                                Text("Delete Account")
                            }
                            .foregroundColor(.red)
                        }
                    } header: {
                        Text("DANGER ZONE")
                            .font(.custom("SpaceGrotesk-Medium", size: 12))
                            .foregroundColor(.signalWhite.opacity(0.5))
                    }

                    // App info
                    Section {
                        HStack {
                            Text("Version")
                            Spacer()
                            Text(Bundle.main.appVersion)
                                .foregroundColor(.signalWhite.opacity(0.5))
                        }
                    }
                }
                .scrollContentBackground(.hidden)
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("SETTINGS")
                        .font(.custom("SpaceGrotesk-Bold", size: 18))
                        .foregroundColor(.signalWhite)
                }
            }
            .alert("Reset Progress?", isPresented: $viewModel.showingResetConfirmation) {
                Button("Cancel", role: .cancel) { }
                Button("Reset", role: .destructive) {
                    Task { await viewModel.resetProgress() }
                }
            } message: {
                Text("This will reset your quit attempt. Your chat history will be kept.")
            }
            .alert("Delete Account?", isPresented: $viewModel.showingDeleteConfirmation) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    Task { await viewModel.deleteAccount() }
                }
            } message: {
                Text("This permanently deletes your account and all data. This cannot be undone.")
            }
        }
    }
}

struct SettingsRow: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.electricCoral)
                .frame(width: 24)

            Text(title)
                .font(.custom("Inter-Regular", size: 16))

            Spacer()

            Text(value)
                .font(.custom("Inter-Regular", size: 14))
                .foregroundColor(.signalWhite.opacity(0.5))
        }
    }
}

extension Bundle {
    var appVersion: String {
        return "\(infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0") (\(infoDictionary?["CFBundleVersion"] as? String ?? "1"))"
    }
}
```

### 4. UI Polish Pass

**Animations & Transitions:**

```swift
// Shared/Transitions/AppTransitions.swift
import SwiftUI

// Tab transition
struct TabTransition: ViewModifier {
    let isActive: Bool

    func body(content: Content) -> some View {
        content
            .opacity(isActive ? 1 : 0)
            .scaleEffect(isActive ? 1 : 0.95)
            .animation(.easeInOut(duration: 0.2), value: isActive)
    }
}

// Card appearance animation
struct CardAppearAnimation: ViewModifier {
    @State private var isVisible = false

    func body(content: Content) -> some View {
        content
            .opacity(isVisible ? 1 : 0)
            .offset(y: isVisible ? 0 : 20)
            .onAppear {
                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                    isVisible = true
                }
            }
    }
}

extension View {
    func cardAppearAnimation() -> some View {
        modifier(CardAppearAnimation())
    }
}

// Haptic feedback helper
struct Haptics {
    static func success() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }

    static func impact(style: UIImpactFeedbackGenerator.FeedbackStyle = .medium) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.impactOccurred()
    }

    static func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
    }
}
```

**Main Tab View Polish:**

```swift
// Features/Main/MainTabView.swift
import SwiftUI

struct MainTabView: View {
    @StateObject private var router = NavigationRouter.shared
    @StateObject private var notificationManager = NotificationManager.shared

    var body: some View {
        TabView(selection: $router.selectedTab) {
            ChatView()
                .tabItem {
                    Label("Chat", systemImage: "bubble.left.fill")
                }
                .tag(NavigationRouter.AppTab.chat)

            ProgressDashboardView()
                .tabItem {
                    Label("Progress", systemImage: "chart.bar.fill")
                }
                .tag(NavigationRouter.AppTab.progress)

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
                .tag(NavigationRouter.AppTab.settings)
        }
        .tint(.electricCoral)
        .task {
            await notificationManager.requestPermission()
        }
    }
}
```

### 5. Error Handling & Empty States

```swift
// Shared/Components/ErrorView.swift
import SwiftUI

struct ErrorView: View {
    let error: Error
    let retryAction: (() async -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 40))
                .foregroundColor(.softEmber)

            Text("Something went wrong")
                .font(.custom("SpaceGrotesk-Bold", size: 20))
                .foregroundColor(.signalWhite)

            Text(error.localizedDescription)
                .font(.custom("Inter-Regular", size: 14))
                .foregroundColor(.signalWhite.opacity(0.6))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            if let retryAction = retryAction {
                Button {
                    Task { await retryAction() }
                } label: {
                    Text("Try Again")
                        .font(.custom("SpaceGrotesk-Medium", size: 16))
                        .foregroundColor(.electricCoral)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.electricCoral, lineWidth: 2)
                        )
                }
            }
        }
    }
}

// Network error specifically
struct NetworkErrorView: View {
    let retryAction: () async -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "wifi.slash")
                .font(.system(size: 40))
                .foregroundColor(.softEmber)

            Text("No Connection")
                .font(.custom("SpaceGrotesk-Bold", size: 20))
                .foregroundColor(.signalWhite)

            Text("Check your internet connection and try again.")
                .font(.custom("Inter-Regular", size: 14))
                .foregroundColor(.signalWhite.opacity(0.6))
                .multilineTextAlignment(.center)

            Button {
                Task { await retryAction() }
            } label: {
                Text("Retry")
                    .font(.custom("SpaceGrotesk-Medium", size: 16))
                    .foregroundColor(.rebelBlack)
                    .padding(.horizontal, 32)
                    .padding(.vertical, 12)
                    .background(Color.electricCoral)
                    .cornerRadius(8)
            }
        }
    }
}

// Loading state
struct LoadingView: View {
    let message: String

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .electricCoral))
                .scaleEffect(1.5)

            Text(message)
                .font(.custom("Inter-Regular", size: 14))
                .foregroundColor(.signalWhite.opacity(0.6))
        }
    }
}
```

---

## Tasks

### Push Notifications (Day 1-2)
- [ ] Set up APNs certificate/key
- [ ] Implement NotificationManager
- [ ] Create push token registration endpoint
- [ ] Build notification handler
- [ ] Test notification delivery

### Vera Check-Ins (Day 2)
- [ ] Define check-in schedules
- [ ] Write milestone notification messages
- [ ] Create cron job for scheduled notifications
- [ ] Test notification timing
- [ ] Handle notification tap navigation

### Settings Screen (Day 3)
- [ ] Build SettingsView
- [ ] Implement notification preferences
- [ ] Add profile editing
- [ ] Add account management (sign out, delete)
- [ ] Implement settings persistence

### UI Polish (Day 4)
- [ ] Add transitions between tabs
- [ ] Implement card animations
- [ ] Add haptic feedback
- [ ] Fix edge case layouts
- [ ] Ensure dark mode consistency

### Error Handling (Day 5)
- [ ] Create ErrorView component
- [ ] Add error handling to all API calls
- [ ] Build NetworkErrorView
- [ ] Create empty states for all screens
- [ ] Test offline scenarios
- [ ] Handle keyboard dismissal properly

---

## Success Criteria

- [ ] Push notifications arrive correctly on device
- [ ] Settings persist across app restarts
- [ ] No visual bugs or jank (test on real devices)
- [ ] Handles network errors gracefully
- [ ] Empty states feel intentional, not broken
- [ ] Notifications route to correct screens on tap
- [ ] App feels polished and cohesive

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Push service | APNs directly | No dependency on third-party SDK |
| Notification scheduling | Server-side cron | Reliable, timezone-aware |
| Settings persistence | Supabase + UserDefaults | Sync + offline access |
| Haptics | UIKit generators | Most control over feedback |

---

## Polish Checklist

### Visual
- [ ] Consistent spacing throughout
- [ ] All text uses brand fonts
- [ ] All colors match brand palette
- [ ] Icons consistent weight/style
- [ ] Animations consistent timing
- [ ] Safe area respected everywhere

### Interaction
- [ ] Touch targets minimum 44pt
- [ ] Haptic feedback on key actions
- [ ] Keyboard dismissal works everywhere
- [ ] Pull-to-refresh where appropriate
- [ ] Loading states for all async operations

### Edge Cases
- [ ] Empty data states
- [ ] Long text truncation
- [ ] Very large numbers display
- [ ] Rapid repeat tapping handled
- [ ] Background to foreground transition
- [ ] Low memory warning handling

---

## Notes

- Push notifications require a physical device for testing (not simulator)
- APNs setup can be finicky—allow extra time
- Test notifications in both foreground and background states
- Settings should sync to server but work offline too
- This is the last feature sprint before App Store prep

---

## Resources

- [APNs Overview](https://developer.apple.com/documentation/usernotifications)
- [UNUserNotificationCenter](https://developer.apple.com/documentation/usernotifications/unusernotificationcenter)
- [Push Notification Setup](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)
- [SwiftUI List Styling](https://developer.apple.com/documentation/swiftui/list)
