# Sprint 9: Progress Dashboard

**Theme**: Show the wins
**Duration**: 1 week

---

## Objective

Build the progress dashboard that motivates users by visualizing their achievements. This screen should make users feel proud, not clinical—every stat tells the story of their success.

---

## Prerequisites

- Sprint 8 complete (chat working)
- Progress API endpoints functional
- Milestones and health timeline data available

---

## Deliverables

### 1. Days Quit Counter

**Hero Stat Component:**

```swift
// Features/Progress/Views/DaysQuitCounter.swift
import SwiftUI

struct DaysQuitCounter: View {
    let days: Int
    let startDate: Date

    @State private var animatedDays: Int = 0
    @State private var isAnimating = false

    var body: some View {
        VStack(spacing: 8) {
            // Main counter
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text("\(animatedDays)")
                    .font(.custom("SpaceMono-Regular", size: 72))
                    .foregroundColor(.emerald)
                    .contentTransition(.numericText())

                Text(animatedDays == 1 ? "day" : "days")
                    .font(.custom("SpaceGrotesk-Medium", size: 24))
                    .foregroundColor(.paper.opacity(0.8))
            }

            Text("smoke-free")
                .font(.custom("SpaceGrotesk-Bold", size: 20))
                .foregroundColor(.paper)

            // Start date
            Text("since \(startDate.formatted(.dateTime.month().day().year()))")
                .font(.custom("Inter-Regular", size: 14))
                .foregroundColor(.paper.opacity(0.5))
        }
        .onAppear {
            animateCounter()
        }
        .onChange(of: days) { _ in
            animateCounter()
        }
    }

    private func animateCounter() {
        guard !isAnimating else { return }
        isAnimating = true

        // Quick animation to current value
        let duration = 0.5
        let steps = 20
        let stepDuration = duration / Double(steps)
        let increment = Double(days) / Double(steps)

        for i in 0..<steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(i)) {
                withAnimation {
                    animatedDays = min(Int(increment * Double(i + 1)), days)
                }
            }
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            animatedDays = days
            isAnimating = false
        }
    }
}

// Time breakdown for context
struct TimeBreakdown: View {
    let totalMinutes: Int

    var body: some View {
        let hours = totalMinutes / 60 % 24
        let days = totalMinutes / 60 / 24

        HStack(spacing: 24) {
            TimeUnit(value: days, label: "days")
            TimeUnit(value: hours, label: "hours")
        }
    }
}

struct TimeUnit: View {
    let value: Int
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text("\(value)")
                .font(.custom("SpaceMono-Regular", size: 28))
                .foregroundColor(.amber)

            Text(label)
                .font(.custom("Inter-Regular", size: 12))
                .foregroundColor(.paper.opacity(0.5))
        }
    }
}
```

### 2. Money Saved Calculator

```swift
// Features/Progress/Views/MoneySavedCard.swift
import SwiftUI

struct MoneySavedCard: View {
    let amount: Double
    let currency: String
    let equivalents: [SavingsEquivalent]

    @State private var showingBreakdown = false

    var body: some View {
        VStack(spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("MONEY SAVED")
                        .font(.custom("SpaceGrotesk-Medium", size: 12))
                        .foregroundColor(.paper.opacity(0.5))

                    HStack(alignment: .firstTextBaseline, spacing: 2) {
                        Text(currency == "AUD" ? "$" : currency)
                            .font(.custom("SpaceMono-Regular", size: 24))
                            .foregroundColor(.amber)

                        Text(String(format: "%.0f", amount))
                            .font(.custom("SpaceMono-Regular", size: 40))
                            .foregroundColor(.amber)
                    }
                }

                Spacer()

                Image(systemName: "dollarsign.circle.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.amber.opacity(0.3))
            }

            // What you could buy
            if !equivalents.isEmpty {
                Divider()
                    .background(Color.paper.opacity(0.1))

                VStack(alignment: .leading, spacing: 8) {
                    Text("That's enough for:")
                        .font(.custom("Inter-Regular", size: 12))
                        .foregroundColor(.paper.opacity(0.5))

                    HStack(spacing: 16) {
                        ForEach(equivalents.prefix(3), id: \.item) { equivalent in
                            EquivalentBadge(equivalent: equivalent)
                        }
                    }
                }
            }
        }
        .padding(20)
        .background(Color.paperAlt)
        .cornerRadius(16)
    }
}

struct EquivalentBadge: View {
    let equivalent: SavingsEquivalent

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: iconName(for: equivalent.icon))
                .font(.system(size: 14))
                .foregroundColor(.emerald)

            Text("\(equivalent.quantity)")
                .font(.custom("SpaceMono-Regular", size: 14))
                .foregroundColor(.paper)

            Text(equivalent.item)
                .font(.custom("Inter-Regular", size: 12))
                .foregroundColor(.paper.opacity(0.7))
        }
    }

    private func iconName(for icon: String) -> String {
        switch icon {
        case "coffee": return "cup.and.saucer.fill"
        case "film": return "film"
        case "tv": return "tv"
        case "utensils": return "fork.knife"
        case "music": return "music.note"
        case "plane": return "airplane"
        default: return "star.fill"
        }
    }
}
```

### 3. Health Milestones Timeline

```swift
// Features/Progress/Views/HealthTimelineView.swift
import SwiftUI

struct HealthTimelineView: View {
    let timeline: HealthTimelineResponse
    @State private var expandedEvent: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Header
            HStack {
                Text("YOUR BODY IS HEALING")
                    .font(.custom("SpaceGrotesk-Bold", size: 18))
                    .foregroundColor(.paper)

                Spacer()

                if let next = timeline.next {
                    NextMilestoneIndicator(
                        event: next,
                        progress: timeline.nextProgress
                    )
                }
            }

            // Timeline
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 0) {
                    ForEach(timeline.achieved, id: \.title) { event in
                        TimelineNode(
                            event: event,
                            isAchieved: true,
                            isExpanded: expandedEvent == event.title
                        ) {
                            toggleExpand(event.title)
                        }
                    }

                    if let next = timeline.next {
                        TimelineNode(
                            event: next,
                            isAchieved: false,
                            progress: Double(timeline.nextProgress) / 100.0,
                            isExpanded: expandedEvent == next.title
                        ) {
                            toggleExpand(next.title)
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
        .padding(.vertical, 20)
        .background(Color.paperAlt)
        .cornerRadius(16)
    }

    private func toggleExpand(_ title: String) {
        withAnimation(.spring(response: 0.3)) {
            expandedEvent = expandedEvent == title ? nil : title
        }
    }
}

struct TimelineNode: View {
    let event: HealthEvent
    let isAchieved: Bool
    var progress: Double = 1.0
    let isExpanded: Bool
    let onTap: () -> Void

    var body: some View {
        VStack(spacing: 12) {
            // Node
            Button(action: onTap) {
                ZStack {
                    Circle()
                        .stroke(isAchieved ? Color.emerald : Color.paperAlt, lineWidth: 3)
                        .frame(width: 44, height: 44)

                    if isAchieved {
                        Circle()
                            .fill(Color.emerald)
                            .frame(width: 36, height: 36)

                        Image(systemName: "checkmark")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.paper)
                    } else {
                        // Progress ring
                        Circle()
                            .trim(from: 0, to: progress)
                            .stroke(Color.emerald.opacity(0.5), lineWidth: 3)
                            .frame(width: 44, height: 44)
                            .rotationEffect(.degrees(-90))
                    }
                }
            }

            // Label
            Text(event.title)
                .font(.custom("Inter-Medium", size: 12))
                .foregroundColor(isAchieved ? .paper : .paper.opacity(0.5))
                .multilineTextAlignment(.center)
                .frame(width: 80)

            // Expanded detail
            if isExpanded {
                Text(event.description)
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(.paper.opacity(0.7))
                    .frame(width: 120)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .frame(width: 100)
    }
}

struct NextMilestoneIndicator: View {
    let event: HealthEvent
    let progress: Int

    var body: some View {
        HStack(spacing: 8) {
            // Progress ring
            ZStack {
                Circle()
                    .stroke(Color.paperAlt, lineWidth: 3)
                    .frame(width: 32, height: 32)

                Circle()
                    .trim(from: 0, to: Double(progress) / 100.0)
                    .stroke(Color.emerald, lineWidth: 3)
                    .frame(width: 32, height: 32)
                    .rotationEffect(.degrees(-90))

                Text("\(progress)%")
                    .font(.custom("SpaceMono-Regular", size: 10))
                    .foregroundColor(.paper)
            }

            VStack(alignment: .leading, spacing: 2) {
                Text("NEXT")
                    .font(.custom("Inter-Medium", size: 10))
                    .foregroundColor(.paper.opacity(0.5))

                Text(event.title)
                    .font(.custom("Inter-Medium", size: 12))
                    .foregroundColor(.emerald)
            }
        }
    }
}
```

### 4. Achievement Badges Display

```swift
// Features/Progress/Views/AchievementsGrid.swift
import SwiftUI

struct AchievementsGrid: View {
    let achievements: [AchievedMilestone]
    @State private var selectedAchievement: AchievedMilestone?

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("ACHIEVEMENTS")
                    .font(.custom("SpaceGrotesk-Bold", size: 18))
                    .foregroundColor(.paper)

                Spacer()

                Text("\(achievements.count) earned")
                    .font(.custom("Inter-Regular", size: 14))
                    .foregroundColor(.paper.opacity(0.5))
            }

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                ForEach(achievements, id: \.key) { achievement in
                    AchievementBadge(achievement: achievement) {
                        selectedAchievement = achievement
                    }
                }
            }
        }
        .sheet(item: $selectedAchievement) { achievement in
            AchievementDetailSheet(achievement: achievement)
        }
    }
}

struct AchievementBadge: View {
    let achievement: AchievedMilestone
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 8) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [.amber, .amber.opacity(0.7)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 60)

                    Image(systemName: iconName(for: achievement.icon))
                        .font(.system(size: 28))
                        .foregroundColor(.ink)
                }

                Text(achievement.title)
                    .font(.custom("Inter-Medium", size: 11))
                    .foregroundColor(.paper)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
        }
    }

    private func iconName(for icon: String) -> String {
        let iconMap: [String: String] = [
            "heart": "heart.fill",
            "lungs": "lungs.fill",
            "shield": "shield.fill",
            "sparkles": "sparkles",
            "trophy": "trophy.fill",
            "star": "star.fill",
            "zap": "bolt.fill",
            "award": "rosette",
            "medal": "medal.fill",
            "crown": "crown.fill",
            "gem": "diamond.fill",
            "dollar": "dollarsign.circle.fill",
            "wallet": "wallet.pass.fill",
            "piggy-bank": "banknote.fill",
            "check": "checkmark.circle.fill",
            "clock": "clock.fill",
            "flame": "flame.fill"
        ]
        return iconMap[icon] ?? "star.fill"
    }
}

struct AchievementDetailSheet: View {
    let achievement: AchievedMilestone
    @Environment(\.dismiss) var dismiss

    var body: some View {
        ZStack {
            Color.ink.ignoresSafeArea()

            VStack(spacing: 24) {
                // Badge
                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [.amber, .amber.opacity(0.5)],
                                center: .center,
                                startRadius: 0,
                                endRadius: 60
                            )
                        )
                        .frame(width: 120, height: 120)

                    Image(systemName: "trophy.fill")
                        .font(.system(size: 56))
                        .foregroundColor(.ink)
                }
                .padding(.top, 40)

                // Title
                Text(achievement.title)
                    .font(.custom("SpaceGrotesk-Bold", size: 28))
                    .foregroundColor(.paper)

                // Description
                Text(achievement.description)
                    .font(.custom("Inter-Regular", size: 16))
                    .foregroundColor(.paper.opacity(0.8))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)

                // Celebration message
                Text(achievement.celebrationMessage)
                    .font(.custom("Inter-Medium", size: 16))
                    .foregroundColor(.emerald)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 16)
                    .background(Color.paperAlt)
                    .cornerRadius(12)
                    .padding(.horizontal, 24)

                // Achieved date
                Text("Achieved \(achievement.achievedAt.formatted(.dateTime.month().day()))")
                    .font(.custom("Inter-Regular", size: 14))
                    .foregroundColor(.paper.opacity(0.5))

                Spacer()

                // Close button
                Button {
                    dismiss()
                } label: {
                    Text("Nice!")
                        .font(.custom("SpaceGrotesk-Bold", size: 18))
                        .foregroundColor(.ink)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color.emerald)
                        .cornerRadius(12)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 32)
            }
        }
        .presentationDetents([.medium, .large])
    }
}
```

### 5. Main Progress Dashboard

```swift
// Features/Progress/Views/ProgressDashboardView.swift
import SwiftUI

struct ProgressDashboardView: View {
    @StateObject private var viewModel = ProgressViewModel()

    var body: some View {
        NavigationStack {
            ZStack {
                Color.ink.ignoresSafeArea()

                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .emerald))
                } else if let stats = viewModel.stats {
                    ScrollView {
                        VStack(spacing: 24) {
                            // Hero: Days quit
                            DaysQuitCounter(
                                days: stats.daysQuit,
                                startDate: Date(timeIntervalSince1970: TimeInterval(stats.startedAtTimestamp))
                            )
                            .padding(.top, 24)

                            // Money saved
                            if let savings = viewModel.savings {
                                MoneySavedCard(
                                    amount: savings.totalSaved,
                                    currency: savings.currency,
                                    equivalents: savings.equivalentTo
                                )
                                .padding(.horizontal, 16)
                            }

                            // Cigarettes avoided
                            CigarettesAvoidedCard(count: stats.cigarettesAvoided)
                                .padding(.horizontal, 16)

                            // Health timeline
                            if let timeline = viewModel.healthTimeline {
                                HealthTimelineView(timeline: timeline)
                                    .padding(.horizontal, 16)
                            }

                            // Achievements
                            if !viewModel.achievements.isEmpty {
                                AchievementsGrid(achievements: viewModel.achievements)
                                    .padding(.horizontal, 16)
                            }

                            Spacer(minLength: 100)
                        }
                    }
                    .refreshable {
                        await viewModel.refresh()
                    }
                } else {
                    NoActiveQuitView {
                        Task {
                            await viewModel.startQuit()
                        }
                    }
                }
            }
            .navigationTitle("Progress")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("YOUR PROGRESS")
                        .font(.custom("SpaceGrotesk-Bold", size: 18))
                        .foregroundColor(.paper)
                }
            }
        }
    }
}

struct CigarettesAvoidedCard: View {
    let count: Int

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("CIGARETTES NOT SMOKED")
                    .font(.custom("SpaceGrotesk-Medium", size: 12))
                    .foregroundColor(.paper.opacity(0.5))

                Text("\(count)")
                    .font(.custom("SpaceMono-Regular", size: 40))
                    .foregroundColor(.emerald)
            }

            Spacer()

            // Visual representation
            ZStack {
                ForEach(0..<min(5, count), id: \.self) { i in
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.emerald.opacity(0.3))
                        .offset(x: CGFloat(i * 8), y: CGFloat(i * -4))
                }
            }
        }
        .padding(20)
        .background(Color.paperAlt)
        .cornerRadius(16)
    }
}

struct NoActiveQuitView: View {
    let onStart: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "flag.fill")
                .font(.system(size: 60))
                .foregroundColor(.emerald)

            Text("Ready to quit?")
                .font(.custom("SpaceGrotesk-Bold", size: 28))
                .foregroundColor(.paper)

            Text("Start tracking your progress and celebrate every smoke-free moment.")
                .font(.custom("Inter-Regular", size: 16))
                .foregroundColor(.paper.opacity(0.7))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            PrimaryButton(title: "START MY QUIT") {
                onStart()
            }
            .padding(.horizontal, 40)
        }
    }
}
```

### 6. Pull-to-Refresh Implementation

The `.refreshable` modifier is used in the main dashboard view above. ViewModel implementation:

```swift
// Features/Progress/ViewModels/ProgressViewModel.swift
import Foundation

@MainActor
class ProgressViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var stats: ProgressStats?
    @Published var savings: MoneySavedBreakdown?
    @Published var healthTimeline: HealthTimelineResponse?
    @Published var achievements: [AchievedMilestone] = []
    @Published var error: Error?

    private let progressService = ProgressService()

    init() {
        Task {
            await loadAll()
        }
    }

    func loadAll() async {
        isLoading = true

        do {
            async let statsTask = progressService.getStats()
            async let savingsTask = progressService.getMoneySaved()
            async let timelineTask = progressService.getHealthTimeline()
            async let achievementsTask = progressService.getAchievements()

            let (stats, savings, timeline, achievements) = try await (
                statsTask, savingsTask, timelineTask, achievementsTask
            )

            self.stats = stats
            self.savings = savings
            self.healthTimeline = timeline
            self.achievements = achievements

        } catch {
            self.error = error
        }

        isLoading = false
    }

    func refresh() async {
        await loadAll()
    }

    func startQuit() async {
        do {
            _ = try await progressService.startQuitAttempt()
            await loadAll()
        } catch {
            self.error = error
        }
    }
}
```

---

## Tasks

### Days Counter (Day 1)
- [ ] Build DaysQuitCounter component
- [ ] Add count-up animation
- [ ] Create TimeBreakdown component
- [ ] Test with various day counts
- [ ] Add start date display

### Money Saved (Day 2)
- [ ] Build MoneySavedCard
- [ ] Create EquivalentBadge component
- [ ] Fetch and display savings data
- [ ] Test with different amounts
- [ ] Handle currency formatting

### Health Timeline (Day 2-3)
- [ ] Build HealthTimelineView
- [ ] Create TimelineNode component
- [ ] Add expand/collapse functionality
- [ ] Show next milestone progress
- [ ] Implement horizontal scroll

### Achievements (Day 3-4)
- [ ] Build AchievementsGrid
- [ ] Create AchievementBadge component
- [ ] Build AchievementDetailSheet
- [ ] Add celebratory UI
- [ ] Test achievement unlocking

### Dashboard Integration (Day 4-5)
- [ ] Build ProgressDashboardView
- [ ] Implement ProgressViewModel
- [ ] Add pull-to-refresh
- [ ] Create NoActiveQuitView
- [ ] Test full flow

### Polish (Day 5)
- [ ] Add haptic feedback on achievements
- [ ] Test animations
- [ ] Check accessibility
- [ ] Fix any visual bugs
- [ ] Optimize API calls

---

## Success Criteria

- [ ] Stats update correctly on refresh
- [ ] Health milestones show accurate timings
- [ ] Achievements display with celebratory UI
- [ ] Dashboard feels motivating, not clinical
- [ ] Pull-to-refresh works smoothly
- [ ] Works offline with cached data
- [ ] Animations feel polished

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data fetching | Parallel async/await | Faster load, single loading state |
| Caching | UserDefaults for stats | Simple, good for offline support |
| Animations | SwiftUI native | Smooth, declarative |
| Achievement detail | Sheet | Native iOS pattern |

---

## UX Principles

- **Make numbers feel real**: "$247 saved" means more as "12 dinners out"
- **Celebrate often**: Every milestone gets a moment
- **Show progress, not just state**: "72% to next milestone"
- **Keep it scannable**: Big numbers, small labels
- **Gold = wins**: Use Amber for achievements consistently

---

## Notes

- Health timeline data based on real medical research
- Animations should be subtle, not distracting
- Consider adding share functionality for milestones
- Cache previous stats to show progress since last visit
- Test with edge cases (day 0, day 1, day 365+)

---

## Resources

- [SwiftUI Charts](https://developer.apple.com/documentation/charts) (for future sprint)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [SwiftUI Animations](https://developer.apple.com/documentation/swiftui/animation)
