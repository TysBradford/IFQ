# Sprint 8: Chat Interface

**Theme**: Talk to Vera
**Duration**: 1 week

---

## Objective

Build the core chat interface where users interact with Vera. This is the heart of the app—the experience must feel responsive, personal, and native iOS.

---

## Prerequisites

- Sprint 7 complete (auth and onboarding working)
- API streaming endpoint functional
- User profile synced to backend

---

## Deliverables

### 1. Chat UI Components

**Message Bubble Component:**

```swift
// Shared/Components/MessageBubble.swift
import SwiftUI

struct MessageBubble: View {
    let message: ChatMessage
    let isUser: Bool

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if isUser { Spacer(minLength: 60) }

            if !isUser {
                // Vera avatar
                VeraAvatar(size: 32)
            }

            VStack(alignment: isUser ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.custom("Inter-Regular", size: 16))
                    .foregroundColor(isUser ? .rebelBlack : .signalWhite)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(isUser ? Color.electricCoral : Color.steadySlate)
                    .cornerRadius(20, corners: isUser ?
                        [.topLeft, .topRight, .bottomLeft] :
                        [.topLeft, .topRight, .bottomRight])

                Text(message.formattedTime)
                    .font(.custom("Inter-Regular", size: 11))
                    .foregroundColor(.signalWhite.opacity(0.4))
            }

            if !isUser { Spacer(minLength: 60) }
        }
        .padding(.horizontal, 16)
    }
}

// Vera's avatar
struct VeraAvatar: View {
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [.electricCoral, .softEmber],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text("V")
                .font(.custom("SpaceGrotesk-Bold", size: size * 0.5))
                .foregroundColor(.signalWhite)
        }
        .frame(width: size, height: size)
    }
}

// Corner radius extension
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat
    var corners: UIRectCorner

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}
```

**Chat Input Field:**

```swift
// Features/Chat/Views/ChatInputView.swift
import SwiftUI

struct ChatInputView: View {
    @Binding var text: String
    let isEnabled: Bool
    let onSend: () -> Void

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(alignment: .bottom, spacing: 12) {
            // Text input
            TextField("Message Vera...", text: $text, axis: .vertical)
                .font(.custom("Inter-Regular", size: 16))
                .foregroundColor(.signalWhite)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.steadySlate)
                .cornerRadius(24)
                .lineLimit(1...5)
                .focused($isFocused)
                .disabled(!isEnabled)

            // Send button
            Button(action: onSend) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.system(size: 36))
                    .foregroundColor(canSend ? .electricCoral : .steadySlate)
            }
            .disabled(!canSend)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.rebelBlack)
    }

    private var canSend: Bool {
        isEnabled && !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
}
```

### 2. Real-time Message Streaming

**Streaming Chat Service:**

```swift
// Core/API/ChatService.swift
import Foundation

class ChatService {
    private let baseURL: URL
    private let keychain = KeychainHelper()

    init() {
        baseURL = URL(string: ProcessInfo.processInfo.environment["API_URL"] ?? "https://api.ifq.app")!
    }

    func sendMessage(
        _ content: String,
        conversationId: String?,
        onChunk: @escaping (String) -> Void,
        onComplete: @escaping (String?) -> Void,
        onError: @escaping (Error) -> Void
    ) {
        let endpoint = baseURL.appendingPathComponent("/api/chat/stream")

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("text/event-stream", forHTTPHeaderField: "Accept")

        if let token = keychain.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let body: [String: Any] = [
            "message": content,
            "conversationId": conversationId as Any
        ]

        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async { onError(error) }
                return
            }

            guard let data = data else {
                DispatchQueue.main.async { onError(ChatError.noData) }
                return
            }

            self.parseSSE(data: data, onChunk: onChunk, onComplete: onComplete)
        }

        task.resume()
    }

    // For streaming with URLSession (requires custom delegate for true streaming)
    func streamMessage(
        _ content: String,
        conversationId: String?
    ) -> AsyncThrowingStream<StreamEvent, Error> {
        AsyncThrowingStream { continuation in
            let endpoint = baseURL.appendingPathComponent("/api/chat/stream")

            var request = URLRequest(url: endpoint)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("text/event-stream", forHTTPHeaderField: "Accept")

            if let token = keychain.getToken() {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }

            let body: [String: Any] = [
                "message": content,
                "conversationId": conversationId as Any
            ]

            request.httpBody = try? JSONSerialization.data(withJSONObject: body)

            let delegate = SSEDelegate(continuation: continuation)
            let session = URLSession(configuration: .default, delegate: delegate, delegateQueue: nil)
            let task = session.dataTask(with: request)

            continuation.onTermination = { _ in
                task.cancel()
            }

            task.resume()
        }
    }

    private func parseSSE(
        data: Data,
        onChunk: @escaping (String) -> Void,
        onComplete: @escaping (String?) -> Void
    ) {
        guard let string = String(data: data, encoding: .utf8) else { return }

        var conversationId: String?
        let lines = string.components(separatedBy: "\n\n")

        for line in lines {
            guard line.hasPrefix("data: ") else { continue }
            let jsonString = String(line.dropFirst(6))

            if jsonString == "[DONE]" {
                DispatchQueue.main.async { onComplete(conversationId) }
                return
            }

            guard let jsonData = jsonString.data(using: .utf8),
                  let json = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any] else {
                continue
            }

            if let convId = json["conversationId"] as? String {
                conversationId = convId
            }

            if let text = json["text"] as? String {
                DispatchQueue.main.async { onChunk(text) }
            }
        }
    }
}

enum StreamEvent {
    case conversationId(String)
    case text(String)
    case done
}

enum ChatError: LocalizedError {
    case noData
    case streamError

    var errorDescription: String? {
        switch self {
        case .noData: return "No response from Vera"
        case .streamError: return "Connection interrupted"
        }
    }
}

// SSE Delegate for true streaming
class SSEDelegate: NSObject, URLSessionDataDelegate {
    let continuation: AsyncThrowingStream<StreamEvent, Error>.Continuation
    private var buffer = ""

    init(continuation: AsyncThrowingStream<StreamEvent, Error>.Continuation) {
        self.continuation = continuation
    }

    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        guard let string = String(data: data, encoding: .utf8) else { return }
        buffer += string

        // Process complete events from buffer
        while let eventEnd = buffer.range(of: "\n\n") {
            let event = String(buffer[..<eventEnd.lowerBound])
            buffer = String(buffer[eventEnd.upperBound...])

            processEvent(event)
        }
    }

    private func processEvent(_ event: String) {
        guard event.hasPrefix("data: ") else { return }
        let jsonString = String(event.dropFirst(6))

        if jsonString == "[DONE]" {
            continuation.yield(.done)
            continuation.finish()
            return
        }

        guard let jsonData = jsonString.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: jsonData) as? [String: Any] else {
            return
        }

        if let convId = json["conversationId"] as? String {
            continuation.yield(.conversationId(convId))
        }

        if let text = json["text"] as? String {
            continuation.yield(.text(text))
        }
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        if let error = error {
            continuation.finish(throwing: error)
        } else {
            continuation.finish()
        }
    }
}
```

### 3. Message History Loading

**Chat ViewModel:**

```swift
// Features/Chat/ViewModels/ChatViewModel.swift
import Foundation
import Combine

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var inputText = ""
    @Published var isLoading = false
    @Published var isStreaming = false
    @Published var error: ChatError?
    @Published var currentStreamingMessage = ""

    private var conversationId: String?
    private let chatService = ChatService()
    private let historyService = ChatHistoryService()

    init() {
        Task {
            await loadHistory()
        }
    }

    func loadHistory() async {
        isLoading = true

        do {
            let history = try await historyService.getRecentHistory()
            messages = history.messages
            conversationId = history.conversationId
        } catch {
            // No history is fine for new users
        }

        isLoading = false
    }

    func sendMessage() {
        let content = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !content.isEmpty else { return }

        // Add user message immediately
        let userMessage = ChatMessage(
            id: UUID().uuidString,
            role: .user,
            content: content,
            createdAt: Date()
        )
        messages.append(userMessage)
        inputText = ""

        // Start streaming response
        isStreaming = true
        currentStreamingMessage = ""

        // Add placeholder for Vera's response
        let veraMessageId = UUID().uuidString
        let veraMessage = ChatMessage(
            id: veraMessageId,
            role: .assistant,
            content: "",
            createdAt: Date(),
            isStreaming: true
        )
        messages.append(veraMessage)

        chatService.sendMessage(
            content,
            conversationId: conversationId,
            onChunk: { [weak self] chunk in
                guard let self = self else { return }
                self.currentStreamingMessage += chunk

                // Update the streaming message
                if let index = self.messages.firstIndex(where: { $0.id == veraMessageId }) {
                    self.messages[index].content = self.currentStreamingMessage
                }
            },
            onComplete: { [weak self] newConversationId in
                guard let self = self else { return }

                if let convId = newConversationId {
                    self.conversationId = convId
                }

                // Mark as complete
                if let index = self.messages.firstIndex(where: { $0.id == veraMessageId }) {
                    self.messages[index].isStreaming = false
                }

                self.isStreaming = false
                self.currentStreamingMessage = ""
            },
            onError: { [weak self] error in
                guard let self = self else { return }

                // Remove failed message
                self.messages.removeAll { $0.id == veraMessageId }
                self.isStreaming = false
                self.error = .streamError

                // Add error message
                let errorMessage = ChatMessage(
                    id: UUID().uuidString,
                    role: .assistant,
                    content: "Sorry, I couldn't connect. Try again?",
                    createdAt: Date(),
                    isError: true
                )
                self.messages.append(errorMessage)
            }
        )
    }

    func retryLastMessage() {
        guard let lastUserMessage = messages.last(where: { $0.role == .user }) else { return }

        // Remove error message
        messages.removeAll { $0.isError }

        inputText = lastUserMessage.content
        messages.removeAll { $0.id == lastUserMessage.id }
        sendMessage()
    }
}
```

### 4. Vera Typing Indicator

```swift
// Shared/Components/TypingIndicator.swift
import SwiftUI

struct TypingIndicator: View {
    @State private var animationStep = 0

    let timer = Timer.publish(every: 0.3, on: .main, in: .common).autoconnect()

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            VeraAvatar(size: 32)

            HStack(spacing: 6) {
                ForEach(0..<3, id: \.self) { index in
                    Circle()
                        .fill(Color.signalWhite.opacity(0.6))
                        .frame(width: 8, height: 8)
                        .offset(y: animationStep == index ? -4 : 0)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color.steadySlate)
            .cornerRadius(20)

            Spacer(minLength: 60)
        }
        .padding(.horizontal, 16)
        .onReceive(timer) { _ in
            withAnimation(.easeInOut(duration: 0.15)) {
                animationStep = (animationStep + 1) % 3
            }
        }
    }
}
```

### 5. Main Chat View

```swift
// Features/Chat/Views/ChatView.swift
import SwiftUI

struct ChatView: View {
    @StateObject private var viewModel = ChatViewModel()
    @FocusState private var isInputFocused: Bool

    var body: some View {
        ZStack {
            Color.rebelBlack.ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                ChatHeader()

                // Messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            if viewModel.messages.isEmpty && !viewModel.isLoading {
                                EmptyStateView()
                            }

                            ForEach(viewModel.messages) { message in
                                MessageBubble(
                                    message: message,
                                    isUser: message.role == .user
                                )
                                .id(message.id)
                            }

                            if viewModel.isStreaming && viewModel.currentStreamingMessage.isEmpty {
                                TypingIndicator()
                            }
                        }
                        .padding(.vertical, 16)
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        scrollToBottom(proxy: proxy)
                    }
                    .onChange(of: viewModel.currentStreamingMessage) { _ in
                        scrollToBottom(proxy: proxy)
                    }
                }

                // Input
                ChatInputView(
                    text: $viewModel.inputText,
                    isEnabled: !viewModel.isStreaming
                ) {
                    viewModel.sendMessage()
                }
            }
        }
        .onTapGesture {
            isInputFocused = false
        }
    }

    private func scrollToBottom(proxy: ScrollViewProxy) {
        guard let lastMessage = viewModel.messages.last else { return }
        withAnimation(.easeOut(duration: 0.2)) {
            proxy.scrollTo(lastMessage.id, anchor: .bottom)
        }
    }
}

struct ChatHeader: View {
    var body: some View {
        HStack {
            VeraAvatar(size: 40)

            VStack(alignment: .leading, spacing: 2) {
                Text("Vera")
                    .font(.custom("SpaceGrotesk-Bold", size: 18))
                    .foregroundColor(.signalWhite)

                Text("Your quit coach")
                    .font(.custom("Inter-Regular", size: 12))
                    .foregroundColor(.signalWhite.opacity(0.6))
            }

            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.steadySlate)
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            VeraAvatar(size: 80)

            Text("Hey. I'm Vera.")
                .font(.custom("SpaceGrotesk-Bold", size: 24))
                .foregroundColor(.signalWhite)

            Text("I'm here whenever you need to talk. About cravings, triggers, wins—whatever's on your mind.")
                .font(.custom("Inter-Regular", size: 16))
                .foregroundColor(.signalWhite.opacity(0.8))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            Text("Go ahead, say something.")
                .font(.custom("Inter-Medium", size: 14))
                .foregroundColor(.electricCoral)
        }
        .padding(.top, 60)
    }
}
```

### 6. Rich Content Support

```swift
// Shared/Components/RichMessageContent.swift
import SwiftUI

struct RichMessageContent: View {
    let content: String

    var body: some View {
        Text(attributedContent)
            .font(.custom("Inter-Regular", size: 16))
    }

    private var attributedContent: AttributedString {
        var result = AttributedString(content)

        // Bold text between **
        let boldPattern = /\*\*(.+?)\*\*/
        for match in content.matches(of: boldPattern) {
            let range = result.range(of: String(match.0))
            if let range = range {
                result[range].font = .custom("Inter-Bold", size: 16)
                // Remove the ** markers
                result.replaceSubrange(range, with: AttributedString(String(match.1)))
            }
        }

        // Italic text between *
        let italicPattern = /\*(.+?)\*/
        for match in content.matches(of: italicPattern) {
            let range = result.range(of: String(match.0))
            if let range = range {
                result[range].font = .custom("Inter-Italic", size: 16)
            }
        }

        return result
    }
}

// For structured content from Vera (stats, tips, etc.)
struct VeraStatCard: View {
    let stat: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(stat)
                .font(.custom("SpaceMono-Regular", size: 28))
                .foregroundColor(.electricCoral)

            Text(label)
                .font(.custom("Inter-Regular", size: 12))
                .foregroundColor(.signalWhite.opacity(0.6))
        }
        .padding(16)
        .background(Color.rebelBlack)
        .cornerRadius(12)
    }
}
```

---

## Tasks

### Chat UI (Day 1-2)
- [ ] Build MessageBubble component
- [ ] Create ChatInputView
- [ ] Build VeraAvatar component
- [ ] Create ChatHeader
- [ ] Implement EmptyStateView

### Streaming (Day 2-3)
- [ ] Build ChatService with SSE support
- [ ] Implement streaming message display
- [ ] Handle connection errors
- [ ] Add retry functionality
- [ ] Test with various network conditions

### Chat ViewModel (Day 3)
- [ ] Implement ChatViewModel
- [ ] Add message history loading
- [ ] Handle streaming state
- [ ] Implement error recovery
- [ ] Add optimistic UI updates

### Typing Indicator (Day 4)
- [ ] Build TypingIndicator component
- [ ] Add animation
- [ ] Show/hide based on streaming state
- [ ] Test timing and feel

### Polish (Day 5)
- [ ] Add scroll-to-bottom behavior
- [ ] Implement keyboard avoidance
- [ ] Test on multiple device sizes
- [ ] Add haptic feedback on send
- [ ] Fix any visual bugs

---

## Success Criteria

- [ ] Messages send and display correctly
- [ ] Streaming responses render smoothly (no jank)
- [ ] History loads on app open
- [ ] Chat feels responsive and native
- [ ] Typing indicator shows appropriately
- [ ] Error states handled gracefully
- [ ] Works offline (shows appropriate message)

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Streaming | Server-Sent Events | Simple, works with URLSession delegate |
| Message IDs | UUID client-side | Immediate optimistic updates |
| Scroll behavior | ScrollViewReader | SwiftUI native, smooth |
| Rich text | AttributedString | iOS 15+ native markdown-like support |

---

## UX Considerations

- **Response feel**: First token should appear within 500ms
- **Streaming smoothness**: Chunks should append without visible jank
- **Input focus**: Keyboard should not cover messages
- **Error recovery**: One tap to retry failed messages
- **Empty state**: Vera should feel welcoming, not empty

---

## Notes

- True SSE streaming requires URLSession delegate approach
- Consider caching recent messages locally for instant load
- Haptic feedback on message send improves feel
- Test with slow 3G to ensure streaming works well
- Add "Vera is typing" to header during streaming

---

## Resources

- [SwiftUI ScrollViewReader](https://developer.apple.com/documentation/swiftui/scrollviewreader)
- [URLSession Delegate](https://developer.apple.com/documentation/foundation/urlsessiondatadelegate)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [AttributedString](https://developer.apple.com/documentation/foundation/attributedstring)
