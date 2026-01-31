# IFQ Brand Prototyping

5 landing page variations exploring the IFQ visual brand identity. All adhere to [BRAND.md](../docs/BRAND.md) but interpret it differently.

## Quick Start

Open any variation directly in your browser:

```bash
# From project root
open prototyping/variation-1-brutalist/index.html
open prototyping/variation-2-warm-rebel/index.html
open prototyping/variation-3-editorial/index.html
open prototyping/variation-4-metrics/index.html
open prototyping/variation-5-kinetic/index.html
```

Or use a local server for best results:

```bash
cd prototyping
npx serve .
# Then visit http://localhost:3000
```

---

## The Variations

### 1. Brutalist Rebellion
**File:** `variation-1-brutalist/`

**Concept:** Maximum contrast, unapologetic boldness. Gallery installation vibe.

| Element | Treatment |
|---------|-----------|
| Background | Full Rebel Black |
| Accent | Electric Coral (sparingly) |
| Typography | 120px+ headlines, ALL CAPS, Space Grotesk |
| Layout | Strict grid, asymmetric, massive negative space |
| Borders | Sharp, 2px solid, no radius |
| Energy | Provocative, demands attention |

**Best for:** Making a statement. Users who want to feel like quitting is a powerful, defiant act.

---

### 2. Warm Rebel
**File:** `variation-2-warm-rebel/`

**Concept:** Inverted palette — Coral as hero. Confident friend energy.

| Element | Treatment |
|---------|-----------|
| Background | Electric Coral hero, Rebel Black body |
| Accent | Signal White, Rebel Black |
| Typography | Space Grotesk headlines, Inter body (18-20px) |
| Layout | Centered, generous padding, welcoming |
| Borders | Subtle 1px Soft Ember |
| Energy | Inviting but not soft |

**Best for:** Approachability without losing edge. Users who need warmth alongside strength.

---

### 3. Editorial
**File:** `variation-3-editorial/`

**Concept:** Magazine/publication aesthetic. Sophisticated typographic hierarchy.

| Element | Treatment |
|---------|-----------|
| Background | Signal White with Rebel Black sections |
| Accent | Electric Coral pull quotes, Victory Gold highlights |
| Typography | Mixed sizes creating rhythm, drop caps, varied weights |
| Layout | Asymmetric columns, off-grid, pull quotes |
| Borders | Thin 1px rules, editorial dividers |
| Energy | Premium publication, something you'd frame |

**Best for:** Credibility and sophistication. Users who appreciate craft and premium quality.

---

### 4. Metrics
**File:** `variation-4-metrics/`

**Concept:** Data-forward, achievement-oriented. Mission control vibe.

| Element | Treatment |
|---------|-----------|
| Background | Steady Slate main, Rebel Black cards |
| Accent | Victory Gold numbers, Electric Coral progress |
| Typography | Space Mono stats (large), Space Grotesk labels |
| Layout | Dashboard grid, card-based |
| Borders | Subtle glow effects on stat cards |
| Energy | Your progress is the hero |

**Best for:** Users motivated by data and visible progress. The tracker as main character.

---

### 5. Kinetic
**File:** `variation-5-kinetic/`

**Concept:** Motion-designed. Even static, it implies explosive energy.

| Element | Treatment |
|---------|-----------|
| Background | Rebel Black with gradient hints |
| Accent | Coral trails, Gold sparks |
| Typography | Staggered placement, varied letter-spacing |
| Layout | Broken grid, angled elements, diagonal energy |
| Borders | None — elements float and overlap |
| Energy | Mid-motion capture, breakthrough moment |

**Best for:** Dynamic, younger audience. The feeling of breaking free.

---

## Comparison Matrix

| Aspect | Brutalist | Warm Rebel | Editorial | Metrics | Kinetic |
|--------|-----------|------------|-----------|---------|---------|
| **Primary Color** | Black | Coral | White | Slate | Black |
| **Energy Level** | High | Medium | Medium | Focused | High |
| **Approachability** | Low | High | Medium | Medium | Medium |
| **Data Focus** | Low | Low | Low | High | Low |
| **Typography Size** | Extreme | Large | Varied | Medium | Large |
| **Grid** | Strict | Centered | Editorial | Dashboard | Broken |
| **Best Audience** | Bold rebels | Warm seekers | Quality lovers | Data trackers | Young disruptors |

---

## Evaluation Criteria

When reviewing these variations, consider:

1. **Screenshot Test** — Would designers want to share this?
2. **Brand Fit** — Does it feel like IFQ? Fierce, warm, credible, irreverent?
3. **Differentiation** — Does it stand out from typical wellness apps?
4. **Scalability** — Can this visual language extend to the full app?
5. **Mobile** — Does it work on smaller screens?
6. **Accessibility** — Is text readable? Sufficient contrast?

---

## Next Steps

After selecting a direction:

1. Refine the chosen variation based on feedback
2. Create component library based on selected design language
3. Apply to landing page in `landing-page/` directory
4. Extend design system to iOS app screens

---

## File Structure

```
prototyping/
├── README.md                       # This file
├── shared/
│   ├── fonts.css                   # Google Fonts imports
│   └── brand-tokens.css            # CSS custom properties
├── variation-1-brutalist/
│   ├── index.html
│   └── styles.css
├── variation-2-warm-rebel/
│   ├── index.html
│   └── styles.css
├── variation-3-editorial/
│   ├── index.html
│   └── styles.css
├── variation-4-metrics/
│   ├── index.html
│   └── styles.css
└── variation-5-kinetic/
    ├── index.html
    └── styles.css
```
