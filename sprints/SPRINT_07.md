# Sprint 7: iOS Auth & Onboarding

**Theme**: First impressions
**Duration**: 1 week

---

## Objective

Build the iOS app foundation with authentication and onboarding. Users should be able to sign in with Apple, complete the onboarding flow to capture their smoking profile, and sync data to the backend.

---

## Prerequisites

- Backend API complete (Sprints 4-6)
- Apple Developer account with Sign In with Apple configured
- Xcode 15+ installed
- Basic SwiftUI knowledge

---

## Deliverables

### 1. Xcode Project Structure

**Project Setup:**

```bash
# Create new Xcode project
# iOS App template
# SwiftUI interface
# Swift language
# Bundle ID: app.ifq.ios
```

**Directory Structure:**

```
IFQ/
├── IFQApp.swift              # App entry point
├── ContentView.swift         # Root view with auth state
├── Info.plist
│
├── Core/
│   ├── API/
│   │   ├── APIClient.swift       # HTTP client
│   │   ├── AuthService.swift     # Auth API calls
│   │   ├── ProfileService.swift  # Profile API calls
│   │   └── Endpoints.swift       # API endpoints
│   ├── Auth/
│   │   ├── AuthManager.swift     # Auth state management
│   │   └── KeychainHelper.swift  # Secure token storage
│   └── Extensions/
│       └── Color+Brand.swift     # Brand colors
│
├── Features/
│   ├── Auth/
│   │   ├── Views/
│   │   │   ├── WelcomeView.swift
│   │   │   └── SignInView.swift
│   │   └── ViewModels/
│   │       └── AuthViewModel.swift
│   │
│   ├── Onboarding/
│   │   ├── Views/
│   │   │   ├── OnboardingContainerView.swift
│   │   │   ├── SmokingHistoryView.swift
│   │   │   ├── TriggersView.swift
│   │   │   ├── MotivationView.swift
│   │   │   └── QuitDateView.swift
│   │   ├── ViewModels/
│   │   │   └── OnboardingViewModel.swift
│   │   └── Models/
│   │       └── OnboardingData.swift
│   │
│   └── Main/
│       └── MainTabView.swift     # Post-onboarding main screen
│
├── Shared/
│   ├── Components/
│   │   ├── PrimaryButton.swift
│   │   ├── TextField+Styled.swift
│   │   └── ProgressIndicator.swift
│   └── Models/
│       ├── User.swift
│       └── SmokingProfile.swift
│
└── Resources/
    ├── Assets.xcassets
    ├── Fonts/
    │   ├── SpaceGrotesk-*.ttf
    │   ├── Inter-*.ttf
    │   └── SpaceMono-*.ttf
    └── Localizable.strings
```

### 2. Sign In with Apple Integration

**AuthenticationServices Setup:**

```swift
// Core/Auth/AuthManager.swift
import AuthenticationServices
import SwiftUI

@MainActor
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var error: AuthError?
    @Published var user: User?

    private let authService = AuthService()
    private let keychain = KeychainHelper()

    init() {
        checkExistingSession()
    }

    private func checkExistingSession() {
        if let token = keychain.getToken() {
            Task {
                await refreshSession(token: token)
            }
        }
    }

    func handleSignInWithApple(_ result: Result<ASAuthorization, Error>) async {
        isLoading = true
        defer { isLoading = false }

        switch result {
        case .success(let authorization):
            guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let identityToken = appleIDCredential.identityToken,
                  let tokenString = String(data: identityToken, encoding: .utf8) else {
                error = .invalidCredential
                return
            }

            do {
                let response = try await authService.signInWithApple(
                    idToken: tokenString,
                    fullName: appleIDCredential.fullName,
                    email: appleIDCredential.email
                )

                keychain.saveToken(response.accessToken)
                keychain.saveRefreshToken(response.refreshToken)

                user = response.user
                isAuthenticated = true
            } catch {
                self.error = .signInFailed(error.localizedDescription)
            }

        case .failure(let error):
            if let authError = error as? ASAuthorizationError,
               authError.code == .canceled {
                // User canceled, not an error
                return
            }
            self.error = .signInFailed(error.localizedDescription)
        }
    }

    func signOut() {
        keychain.deleteToken()
        keychain.deleteRefreshToken()
        user = nil
        isAuthenticated = false
    }

    private func refreshSession(token: String) async {
        do {
            let response = try await authService.refreshSession(token: token)
            keychain.saveToken(response.accessToken)
            user = response.user
            isAuthenticated = true
        } catch {
            // Token expired or invalid, clear and require re-auth
            signOut()
        }
    }
}

enum AuthError: LocalizedError {
    case invalidCredential
    case signInFailed(String)
    case networkError

    var errorDescription: String? {
        switch self {
        case .invalidCredential:
            return "Invalid credentials received"
        case .signInFailed(let message):
            return message
        case .networkError:
            return "Network connection failed"
        }
    }
}
```

**Sign In Button:**

```swift
// Features/Auth/Views/SignInView.swift
import SwiftUI
import AuthenticationServices

struct SignInView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        ZStack {
            Color.rebelBlack.ignoresSafeArea()

            VStack(spacing: 40) {
                Spacer()

                // Logo
                Text("IFQ")
                    .font(.custom("SpaceGrotesk-Bold", size: 72))
                    .foregroundColor(.signalWhite)

                Text("QUIT LIKE YOU MEAN IT.")
                    .font(.custom("SpaceGrotesk-Bold", size: 24))
                    .foregroundColor(.electricCoral)

                Spacer()

                // Sign in button
                SignInWithAppleButton(.signIn) { request in
                    request.requestedScopes = [.fullName, .email]
                } onCompletion: { result in
                    Task {
                        await authManager.handleSignInWithApple(result)
                    }
                }
                .signInWithAppleButtonStyle(.white)
                .frame(height: 56)
                .cornerRadius(12)
                .padding(.horizontal, 24)

                // Terms
                Text("By signing in, you agree to our Terms and Privacy Policy")
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(.signalWhite.opacity(0.6))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)

                Spacer()
                    .frame(height: 40)
            }
        }
    }
}
```

### 3. Onboarding Flow Screens

**Onboarding Container:**

```swift
// Features/Onboarding/Views/OnboardingContainerView.swift
import SwiftUI

struct OnboardingContainerView: View {
    @StateObject private var viewModel = OnboardingViewModel()
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        ZStack {
            Color.rebelBlack.ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress indicator
                ProgressIndicator(
                    current: viewModel.currentStep,
                    total: viewModel.totalSteps
                )
                .padding(.top, 16)
                .padding(.horizontal, 24)

                // Content
                TabView(selection: $viewModel.currentStep) {
                    SmokingHistoryView(viewModel: viewModel)
                        .tag(1)

                    TriggersView(viewModel: viewModel)
                        .tag(2)

                    MotivationView(viewModel: viewModel)
                        .tag(3)

                    QuitDateView(viewModel: viewModel)
                        .tag(4)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: viewModel.currentStep)
            }
        }
        .alert("Error", isPresented: $viewModel.showError) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(viewModel.errorMessage)
        }
    }
}
```

**Smoking History Screen:**

```swift
// Features/Onboarding/Views/SmokingHistoryView.swift
import SwiftUI

struct SmokingHistoryView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    @FocusState private var focusedField: Field?

    enum Field {
        case cigarettesPerDay
        case yearsSmoking
        case packPrice
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("LET'S GET TO KNOW YOU")
                        .font(.custom("SpaceGrotesk-Bold", size: 24))
                        .foregroundColor(.electricCoral)

                    Text("No judgment. Just context to help Vera help you.")
                        .font(.custom("Inter-Regular", size: 16))
                        .foregroundColor(.signalWhite.opacity(0.8))
                }
                .padding(.top, 32)

                // Cigarettes per day
                VStack(alignment: .leading, spacing: 8) {
                    Text("Cigarettes per day")
                        .font(.custom("Inter-Medium", size: 14))
                        .foregroundColor(.signalWhite.opacity(0.6))

                    HStack {
                        TextField("", value: $viewModel.cigarettesPerDay, format: .number)
                            .keyboardType(.numberPad)
                            .font(.custom("SpaceMono-Regular", size: 32))
                            .foregroundColor(.signalWhite)
                            .focused($focusedField, equals: .cigarettesPerDay)

                        Text("per day")
                            .font(.custom("Inter-Regular", size: 16))
                            .foregroundColor(.signalWhite.opacity(0.6))

                        Spacer()
                    }
                    .padding()
                    .background(Color.steadySlate)
                    .cornerRadius(12)
                }

                // Years smoking
                VStack(alignment: .leading, spacing: 8) {
                    Text("How long have you been smoking?")
                        .font(.custom("Inter-Medium", size: 14))
                        .foregroundColor(.signalWhite.opacity(0.6))

                    HStack {
                        TextField("", value: $viewModel.yearsSmoking, format: .number)
                            .keyboardType(.numberPad)
                            .font(.custom("SpaceMono-Regular", size: 32))
                            .foregroundColor(.signalWhite)
                            .focused($focusedField, equals: .yearsSmoking)

                        Text("years")
                            .font(.custom("Inter-Regular", size: 16))
                            .foregroundColor(.signalWhite.opacity(0.6))

                        Spacer()
                    }
                    .padding()
                    .background(Color.steadySlate)
                    .cornerRadius(12)
                }

                // Pack price
                VStack(alignment: .leading, spacing: 8) {
                    Text("What does a pack cost you?")
                        .font(.custom("Inter-Medium", size: 14))
                        .foregroundColor(.signalWhite.opacity(0.6))

                    HStack {
                        Text("$")
                            .font(.custom("SpaceMono-Regular", size: 32))
                            .foregroundColor(.signalWhite)

                        TextField("", value: $viewModel.packPrice, format: .number)
                            .keyboardType(.decimalPad)
                            .font(.custom("SpaceMono-Regular", size: 32))
                            .foregroundColor(.signalWhite)
                            .focused($focusedField, equals: .packPrice)

                        Spacer()
                    }
                    .padding()
                    .background(Color.steadySlate)
                    .cornerRadius(12)
                }

                Spacer()

                // Next button
                PrimaryButton(title: "Next") {
                    viewModel.nextStep()
                }
                .disabled(!viewModel.canProceedFromStep1)
                .padding(.bottom, 32)
            }
            .padding(.horizontal, 24)
        }
        .onTapGesture {
            focusedField = nil
        }
    }
}
```

**Triggers Selection Screen:**

```swift
// Features/Onboarding/Views/TriggersView.swift
import SwiftUI

struct TriggersView: View {
    @ObservedObject var viewModel: OnboardingViewModel

    let triggers = [
        ("Stress", "When work or life gets heavy"),
        ("Alcohol", "Social drinks lead to smoking"),
        ("Boredom", "Nothing to do, might as well smoke"),
        ("Social", "When others around you smoke"),
        ("Morning", "First thing with coffee"),
        ("After meals", "The post-food ritual"),
        ("Driving", "Long drives or commutes"),
        ("Anxiety", "When you're feeling on edge")
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("WHAT TRIGGERS YOU?")
                        .font(.custom("SpaceGrotesk-Bold", size: 24))
                        .foregroundColor(.electricCoral)

                    Text("Select all that apply. Vera will learn your patterns.")
                        .font(.custom("Inter-Regular", size: 16))
                        .foregroundColor(.signalWhite.opacity(0.8))
                }
                .padding(.top, 32)

                // Trigger grid
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 12) {
                    ForEach(triggers, id: \.0) { trigger in
                        TriggerCard(
                            title: trigger.0,
                            subtitle: trigger.1,
                            isSelected: viewModel.selectedTriggers.contains(trigger.0)
                        ) {
                            viewModel.toggleTrigger(trigger.0)
                        }
                    }
                }

                Spacer()

                // Navigation
                HStack(spacing: 16) {
                    SecondaryButton(title: "Back") {
                        viewModel.previousStep()
                    }
                    .frame(maxWidth: .infinity)

                    PrimaryButton(title: "Next") {
                        viewModel.nextStep()
                    }
                    .frame(maxWidth: .infinity)
                    .disabled(viewModel.selectedTriggers.isEmpty)
                }
                .padding(.bottom, 32)
            }
            .padding(.horizontal, 24)
        }
    }
}

struct TriggerCard: View {
    let title: String
    let subtitle: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.custom("SpaceGrotesk-Medium", size: 16))
                    .foregroundColor(isSelected ? .rebelBlack : .signalWhite)

                Text(subtitle)
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(isSelected ? .rebelBlack.opacity(0.7) : .signalWhite.opacity(0.6))
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(isSelected ? Color.electricCoral : Color.steadySlate)
            .cornerRadius(12)
        }
    }
}
```

**Motivation Screen:**

```swift
// Features/Onboarding/Views/MotivationView.swift
import SwiftUI

struct MotivationView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    @FocusState private var isFocused: Bool

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("WHY ARE YOU QUITTING?")
                        .font(.custom("SpaceGrotesk-Bold", size: 24))
                        .foregroundColor(.electricCoral)

                    Text("This is personal. Vera will remind you when things get hard.")
                        .font(.custom("Inter-Regular", size: 16))
                        .foregroundColor(.signalWhite.opacity(0.8))
                }
                .padding(.top, 32)

                // Text input
                TextEditor(text: $viewModel.motivation)
                    .font(.custom("Inter-Regular", size: 16))
                    .foregroundColor(.signalWhite)
                    .scrollContentBackground(.hidden)
                    .padding(16)
                    .frame(minHeight: 150)
                    .background(Color.steadySlate)
                    .cornerRadius(12)
                    .focused($isFocused)

                Text("\(viewModel.motivation.count)/300")
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(.signalWhite.opacity(0.4))
                    .frame(maxWidth: .infinity, alignment: .trailing)

                // Prompt suggestions
                VStack(alignment: .leading, spacing: 8) {
                    Text("Need a starting point?")
                        .font(.custom("Inter-Medium", size: 14))
                        .foregroundColor(.signalWhite.opacity(0.6))

                    ForEach(prompts, id: \.self) { prompt in
                        Button {
                            viewModel.motivation = prompt
                        } label: {
                            Text(""\(prompt)"")
                                .font(.custom("Inter-Regular", size: 14))
                                .foregroundColor(.electricCoral)
                        }
                    }
                }

                Spacer()

                // Navigation
                HStack(spacing: 16) {
                    SecondaryButton(title: "Back") {
                        viewModel.previousStep()
                    }
                    .frame(maxWidth: .infinity)

                    PrimaryButton(title: "Next") {
                        viewModel.nextStep()
                    }
                    .frame(maxWidth: .infinity)
                }
                .padding(.bottom, 32)
            }
            .padding(.horizontal, 24)
        }
        .onTapGesture {
            isFocused = false
        }
    }

    let prompts = [
        "I want to be around for my kids.",
        "I'm tired of being controlled by nicotine.",
        "I want to feel healthy again."
    ]
}
```

**Quit Date Screen:**

```swift
// Features/Onboarding/Views/QuitDateView.swift
import SwiftUI

struct QuitDateView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("WHEN DO YOU QUIT?")
                        .font(.custom("SpaceGrotesk-Bold", size: 24))
                        .foregroundColor(.electricCoral)

                    Text("Pick a date or start right now. Either way, we've got you.")
                        .font(.custom("Inter-Regular", size: 16))
                        .foregroundColor(.signalWhite.opacity(0.8))
                }
                .padding(.top, 32)

                // Quick options
                VStack(spacing: 12) {
                    QuickDateOption(
                        title: "RIGHT NOW",
                        subtitle: "Let's do this",
                        isSelected: viewModel.quitDateOption == .now
                    ) {
                        viewModel.quitDateOption = .now
                        viewModel.quitDate = Date()
                    }

                    QuickDateOption(
                        title: "TOMORROW",
                        subtitle: "One more day to prepare",
                        isSelected: viewModel.quitDateOption == .tomorrow
                    ) {
                        viewModel.quitDateOption = .tomorrow
                        viewModel.quitDate = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
                    }

                    QuickDateOption(
                        title: "PICK A DATE",
                        subtitle: "Plan ahead",
                        isSelected: viewModel.quitDateOption == .custom
                    ) {
                        viewModel.quitDateOption = .custom
                    }
                }

                // Date picker (if custom)
                if viewModel.quitDateOption == .custom {
                    DatePicker(
                        "Quit date",
                        selection: $viewModel.quitDate,
                        in: Date()...,
                        displayedComponents: [.date]
                    )
                    .datePickerStyle(.graphical)
                    .colorScheme(.dark)
                    .tint(.electricCoral)
                }

                Spacer()

                // Complete button
                HStack(spacing: 16) {
                    SecondaryButton(title: "Back") {
                        viewModel.previousStep()
                    }
                    .frame(maxWidth: .infinity)

                    PrimaryButton(
                        title: viewModel.isLoading ? "Saving..." : "LET'S GO",
                        isLoading: viewModel.isLoading
                    ) {
                        Task {
                            await viewModel.completeOnboarding()
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .disabled(viewModel.isLoading)
                }
                .padding(.bottom, 32)
            }
            .padding(.horizontal, 24)
        }
    }
}
```

### 4. Profile Setup and Persistence

**Onboarding ViewModel:**

```swift
// Features/Onboarding/ViewModels/OnboardingViewModel.swift
import Foundation

enum QuitDateOption {
    case now
    case tomorrow
    case custom
}

@MainActor
class OnboardingViewModel: ObservableObject {
    // Steps
    @Published var currentStep = 1
    let totalSteps = 4

    // Step 1: Smoking history
    @Published var cigarettesPerDay: Int?
    @Published var yearsSmoking: Int?
    @Published var packPrice: Double?

    // Step 2: Triggers
    @Published var selectedTriggers: Set<String> = []

    // Step 3: Motivation
    @Published var motivation: String = ""

    // Step 4: Quit date
    @Published var quitDateOption: QuitDateOption = .now
    @Published var quitDate: Date = Date()

    // State
    @Published var isLoading = false
    @Published var showError = false
    @Published var errorMessage = ""

    private let profileService = ProfileService()

    var canProceedFromStep1: Bool {
        cigarettesPerDay != nil && yearsSmoking != nil && packPrice != nil
    }

    func toggleTrigger(_ trigger: String) {
        if selectedTriggers.contains(trigger) {
            selectedTriggers.remove(trigger)
        } else {
            selectedTriggers.insert(trigger)
        }
    }

    func nextStep() {
        withAnimation {
            currentStep = min(currentStep + 1, totalSteps)
        }
    }

    func previousStep() {
        withAnimation {
            currentStep = max(currentStep - 1, 1)
        }
    }

    func completeOnboarding() async {
        isLoading = true

        do {
            let profile = SmokingProfile(
                cigarettesPerDay: cigarettesPerDay ?? 20,
                yearsSmoking: yearsSmoking ?? 1,
                packPrice: packPrice ?? 35,
                currency: "AUD",
                primaryTriggers: Array(selectedTriggers),
                previousQuitAttempts: 0,
                motivation: motivation.isEmpty ? nil : motivation,
                quitDate: quitDate
            )

            try await profileService.saveSmokingProfile(profile)

            // Start quit attempt if quit date is now or in past
            if quitDate <= Date() {
                try await profileService.startQuitAttempt()
            }

            // Navigate to main app
            NotificationCenter.default.post(name: .onboardingCompleted, object: nil)

        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }

        isLoading = false
    }
}

extension Notification.Name {
    static let onboardingCompleted = Notification.Name("onboardingCompleted")
}
```

### 5. API Client Setup

```swift
// Core/API/APIClient.swift
import Foundation

actor APIClient {
    static let shared = APIClient()

    private let baseURL: URL
    private let session: URLSession
    private let keychain = KeychainHelper()

    init() {
        baseURL = URL(string: ProcessInfo.processInfo.environment["API_URL"] ?? "https://api.ifq.app")!
        session = URLSession.shared
    }

    func request<T: Decodable>(
        _ endpoint: Endpoint,
        method: HTTPMethod = .get,
        body: Encodable? = nil
    ) async throws -> T {
        var request = URLRequest(url: baseURL.appendingPathComponent(endpoint.path))
        request.httpMethod = method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add auth token
        if let token = keychain.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        // Add body
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        switch httpResponse.statusCode {
        case 200...299:
            return try JSONDecoder().decode(T.self, from: data)
        case 401:
            throw APIError.unauthorized
        case 429:
            throw APIError.rateLimited
        default:
            throw APIError.serverError(httpResponse.statusCode)
        }
    }
}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}

enum APIError: LocalizedError {
    case invalidResponse
    case unauthorized
    case rateLimited
    case serverError(Int)
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidResponse: return "Invalid response from server"
        case .unauthorized: return "Please sign in again"
        case .rateLimited: return "Too many requests. Please wait."
        case .serverError(let code): return "Server error: \(code)"
        case .networkError(let error): return error.localizedDescription
        }
    }
}
```

### 6. Offline Handling

```swift
// Core/Persistence/OfflineManager.swift
import Foundation
import Network

class OfflineManager: ObservableObject {
    @Published var isOnline = true

    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isOnline = path.status == .satisfied
            }
        }
        monitor.start(queue: queue)
    }

    deinit {
        monitor.cancel()
    }
}

// Usage in views
struct ContentView: View {
    @StateObject private var offline = OfflineManager()

    var body: some View {
        ZStack {
            // Main content

            if !offline.isOnline {
                OfflineBanner()
            }
        }
    }
}

struct OfflineBanner: View {
    var body: some View {
        VStack {
            HStack {
                Image(systemName: "wifi.slash")
                Text("You're offline. Some features may be limited.")
            }
            .font(.custom("Inter-Medium", size: 14))
            .foregroundColor(.rebelBlack)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.victoryGold)
            .cornerRadius(8)
            .padding()

            Spacer()
        }
    }
}
```

---

## Tasks

### Project Setup (Day 1)
- [ ] Create Xcode project with correct bundle ID
- [ ] Set up folder structure
- [ ] Add brand fonts to project
- [ ] Configure Info.plist for Sign In with Apple
- [ ] Create Color+Brand extension

### Auth Flow (Day 2)
- [ ] Implement AuthManager
- [ ] Build SignInView with Apple button
- [ ] Set up KeychainHelper for token storage
- [ ] Create AuthService for API calls
- [ ] Test full sign in flow

### Onboarding Screens (Day 3-4)
- [ ] Build OnboardingContainerView
- [ ] Create SmokingHistoryView
- [ ] Create TriggersView
- [ ] Create MotivationView
- [ ] Create QuitDateView
- [ ] Build OnboardingViewModel

### API Integration (Day 4-5)
- [ ] Build APIClient
- [ ] Create ProfileService
- [ ] Implement profile sync
- [ ] Handle API errors
- [ ] Test end-to-end flow

### Polish (Day 5)
- [ ] Add offline detection
- [ ] Handle edge cases
- [ ] Test on multiple devices
- [ ] Fix any UI issues
- [ ] Add loading states

---

## Success Criteria

- [ ] User can sign in with Apple
- [ ] Onboarding captures all required data
- [ ] Data syncs to backend successfully
- [ ] App handles offline gracefully
- [ ] Smooth animations and transitions
- [ ] No crashes on simulator or device

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Framework | SwiftUI | Modern, declarative, good for iOS 15+ |
| Architecture | MVVM | Clean separation, testable |
| Token storage | Keychain | Secure, persists across reinstalls |
| Networking | URLSession + async/await | Native, no dependencies |
| State management | @Published + ObservableObject | SwiftUI native |

---

## Notes

- Focus on iOS 16+ for better SwiftUI features
- Sign In with Apple is required for App Store if offering other social logins
- Store only access token in keychain, refresh token separately
- Onboarding data should be cached locally as backup
- Test on both iPhone SE (small) and iPhone Pro Max (large)

---

## Resources

- [Sign In with Apple](https://developer.apple.com/sign-in-with-apple/)
- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [Keychain Services](https://developer.apple.com/documentation/security/keychain_services)
- [Network Framework](https://developer.apple.com/documentation/network)
