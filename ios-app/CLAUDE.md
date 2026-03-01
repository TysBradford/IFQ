# iOS App UI Guidelines

Refer to the root `CLAUDE.md` for full brand guidelines.

## Color Definitions

Define in Asset Catalog or as Swift extensions:

```swift
extension Color {
    static let ink = Color(red: 10/255, green: 10/255, blue: 10/255)
    static let emerald = Color(red: 0/255, green: 168/255, blue: 120/255)
    static let emeraldSoft = Color(red: 45/255, green: 184/255, blue: 142/255)
    static let paper = Color(red: 250/255, green: 250/255, blue: 248/255)
    static let paperAlt = Color(red: 240/255, green: 240/255, blue: 236/255)
    static let amber = Color(red: 245/255, green: 166/255, blue: 35/255)
    static let mint = Color(red: 125/255, green: 219/255, blue: 163/255)
}
```

Hex values:
- Ink: `#0A0A0A`
- Emerald: `#00A878`
- Emerald Soft: `#2DB88E`
- Paper: `#FAFAF8`
- Paper Alt: `#F0F0EC`
- Amber: `#F5A623`
- Mint: `#7DDBA3`

## Typography

| Use | Font | Weight | SwiftUI |
|-----|------|--------|---------|
| Headlines | Space Grotesk | Bold (700) | `.custom("SpaceGrotesk-Bold", size: ...)` |
| Body | Inter | Regular/Medium | `.custom("Inter-Regular", size: ...)` |
| UI/Buttons | Space Grotesk | Medium (500) | `.custom("SpaceGrotesk-Medium", size: ...)` |
| Stats/Numbers | Space Mono | Regular (400) | `.custom("SpaceMono-Regular", size: ...)` |

## Component Patterns

### Primary Buttons
- Background: Emerald
- Text: White or Ink
- Font: Space Grotesk Medium
- High contrast, bold presence

### Secondary Buttons
- Background: Paper Alt
- Text: Ink
- Outlined variant: Emerald border

### Cards
- Background: Paper Alt on Paper
- Ink border for depth
- Rounded corners (moderate, not excessive)

### Stats Display
- Font: Space Mono
- Numbers prominent
- Use Amber for achievements/milestones

### Navigation
- Paper backgrounds with Ink borders
- Active state: Emerald accent
- Font: Space Grotesk Medium

## Color Mode

The app uses a **paper-first** light aesthetic:
- Primary background: Paper
- Secondary surfaces: Paper Alt
- Text: Ink
- Accents: Emerald, Amber

Dark mode can adapt: Ink backgrounds, Paper text, Emerald/Amber accents.

## Vera Chat Interface

- Vera messages: Emerald bubbles with white text
- User messages: Paper with Ink border
- Timestamps: Muted, Space Mono
- Input field: Paper Alt with Ink text

## Design Excellence

The IFQ app must be award-calibre work. Every screen, every interaction, every micro-animation should feel hand-crafted by the best in the industry. This is not a generic app with brand colours applied — it is a premium, bespoke experience.

**Standards:**
- Interactions feel buttery smooth and intentional
- Typography, spacing, and layout are pixel-perfect
- Animations and transitions are crafted, not default — use SwiftUI's matched geometry, spring animations, and custom timing curves
- Every screen tells a story and guides the user with clarity
- The app should feel like a luxury product, not a health utility
- Details that most apps skip — we obsess over
- Nothing ships that feels "good enough" — it ships when it's exceptional

**What this looks like in iOS:**
- Custom spring animations with tuned response, damping, and blend durations
- Haptic feedback that reinforces key moments (milestones, completing actions, craving timer)
- Gesture-driven interactions that feel native and fluid
- Thoughtful use of blur, vibrancy, and depth for visual hierarchy
- Smooth keyboard handling and input transitions
- Skeleton/shimmer loading states that maintain the brand feel
- Accessibility built in from the start, not bolted on

**The bar:** Apple Design Award calibre. The kind of app designers screenshot and share. Users notice the craft, even if they can't articulate why it feels so good.

## Visual Style

- High contrast always
- Bold, not soft or pastel
- Avoid clinical/medical aesthetic
- No stock photo vibes
- Clean, confident, editorial

## Iconography

- SF Symbols where appropriate
- Custom icons: 2-3px stroke minimum
- Rounded corners for approachability
- Filled variants for emphasis
- Maintain brand colors

## What to Avoid

- iOS default blue tints
- Soft, muted color schemes
- Pastel wellness aesthetics
- Generic health app patterns
- Clinical blues or passive pinks
