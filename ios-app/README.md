# IFQ iOS App

SwiftUI iOS application for the IFQ project.

## Setup

### Prerequisites
- Xcode 15+
- iOS 17+ deployment target

### Getting Started

1. Open `IFQ.xcodeproj` in Xcode
2. Select your development team in Signing & Capabilities
3. Build and run on simulator or device

## Project Structure

```
ios-app/
├── IFQ/
│   ├── App/              # App entry point
│   ├── Features/         # Feature modules
│   ├── Core/             # Core utilities
│   ├── Models/           # Data models
│   └── Services/         # API and services
└── IFQTests/             # Unit tests
```

## Configuration

Create a `Config.xcconfig` file with:

```
SUPABASE_URL = your_supabase_url
SUPABASE_ANON_KEY = your_supabase_anon_key
```

## Development

### Architecture
- SwiftUI for UI
- Async/await for concurrency
- Supabase for backend

### Testing

Run tests with `Cmd+U` in Xcode or via CLI:

```bash
xcodebuild test -scheme IFQ -destination 'platform=iOS Simulator,name=iPhone 15'
```
