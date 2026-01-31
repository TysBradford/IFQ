# iOS App UI Guidelines

Refer to the root `CLAUDE.md` for full brand guidelines.

## Color Definitions

Define in Asset Catalog or as Swift extensions:

```swift
extension Color {
    static let rebelBlack = Color(red: 13/255, green: 13/255, blue: 13/255)
    static let electricCoral = Color(red: 255/255, green: 107/255, blue: 91/255)
    static let signalWhite = Color(red: 250/255, green: 250/255, blue: 250/255)
    static let victoryGold = Color(red: 255/255, green: 217/255, blue: 61/255)
    static let steadySlate = Color(red: 45/255, green: 52/255, blue: 54/255)
    static let softEmber = Color(red: 255/255, green: 139/255, blue: 122/255)
}
```

Hex values:
- Rebel Black: `#0D0D0D`
- Electric Coral: `#FF6B5B`
- Signal White: `#FAFAFA`
- Victory Gold: `#FFD93D`
- Steady Slate: `#2D3436`
- Soft Ember: `#FF8B7A`

## Typography

| Use | Font | Weight | SwiftUI |
|-----|------|--------|---------|
| Headlines | Space Grotesk | Bold (700) | `.custom("SpaceGrotesk-Bold", size: ...)` |
| Body | Inter | Regular/Medium | `.custom("Inter-Regular", size: ...)` |
| UI/Buttons | Space Grotesk | Medium (500) | `.custom("SpaceGrotesk-Medium", size: ...)` |
| Stats/Numbers | Space Mono | Regular (400) | `.custom("SpaceMono-Regular", size: ...)` |

## Component Patterns

### Primary Buttons
- Background: Electric Coral
- Text: Rebel Black or Signal White
- Font: Space Grotesk Medium
- High contrast, bold presence

### Secondary Buttons
- Background: Steady Slate
- Text: Signal White
- Outlined variant: Electric Coral border

### Cards
- Background: Steady Slate on Rebel Black
- Subtle shadow or border for depth
- Rounded corners (moderate, not excessive)

### Stats Display
- Font: Space Mono
- Numbers prominent
- Use Victory Gold for achievements/milestones

### Navigation
- Dark backgrounds (Rebel Black or Steady Slate)
- Active state: Electric Coral accent
- Font: Space Grotesk Medium

## Dark Mode

The app should be **dark mode by default**:
- Primary background: Rebel Black
- Secondary surfaces: Steady Slate
- Text: Signal White
- Accents: Electric Coral, Victory Gold

Light mode is optional/secondary if supported.

## Vera Chat Interface

- Vera messages: Steady Slate bubbles
- User messages: Electric Coral or subtle outline
- Timestamps: Muted, Space Mono
- Input field: Dark with Signal White text

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
- Dark, confident, modern

## Iconography

- SF Symbols where appropriate
- Custom icons: 2-3px stroke minimum
- Rounded corners for approachability
- Filled variants for emphasis
- Maintain brand colors

## What to Avoid

- iOS default blue tints
- Clinical whites as primary background
- Soft, muted color schemes
- Pastel wellness aesthetics
- Generic health app patterns
