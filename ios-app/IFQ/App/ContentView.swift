import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("IFQ")
                .font(.largeTitle)
                .fontWeight(.bold)
            Text("Coming soon")
                .foregroundColor(.secondary)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
