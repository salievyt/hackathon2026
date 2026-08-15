# Hackathon Design System — Electric Blue

version: alpha
name: Hackathon-Electric-Blue
description: A high-impact hackathon landing system built around Electric Blue (#4353FE), oversized editorial typography, sharp contrast, generous whitespace, glass navigation and modular showcase sections. The interface feels fast, technical and competitive without relying on decorative gradients or excessive UI chrome. Electric Blue is the single interactive brand signal, while deep navy, white and cool neutral surfaces create the visual foundation.

---

## colors

### Brand

primary: "#4353FE"
primary-hover: "#3444E8"
primary-active: "#2636D1"
primary-soft: "#EEF0FF"
primary-subtle: "#F5F6FF"
primary-on-dark: "#6674FF"
on-primary: "#FFFFFF"

### Dark

ink: "#0B0D17"
ink-soft: "#171A2A"
ink-muted: "#62677A"
surface-dark: "#0B0D17"
surface-dark-2: "#111425"
surface-dark-3: "#181B2E"
on-dark: "#FFFFFF"
on-dark-muted: "#B7BBCB"

### Light

canvas: "#FFFFFF"
canvas-soft: "#F7F8FC"
canvas-muted: "#EEF0F6"
surface: "#FFFFFF"
surface-elevated: "#FAFAFD"

### Borders

border: "#E4E6EF"
border-strong: "#D6D9E5"
border-on-dark: "#292D42"
divider: "#ECEEF4"

### Status

success: "#19B86B"
warning: "#F5A623"
error: "#EF4B5F"

---

## typography

### Font Family

display:
fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"

body:
fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"

mono:
fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"

The landing should use one primary sans-serif family. Inter is the default choice because it is highly legible, contemporary and available across platforms.

---

## hierarchy

hero-display:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 72px
fontWeight: 700
lineHeight: 0.98
letterSpacing: -3.2px

display-xl:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 56px
fontWeight: 700
lineHeight: 1.02
letterSpacing: -2.4px

display-lg:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 44px
fontWeight: 700
lineHeight: 1.05
letterSpacing: -1.8px

display-md:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 36px
fontWeight: 700
lineHeight: 1.1
letterSpacing: -1.2px

heading:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 28px
fontWeight: 650
lineHeight: 1.15
letterSpacing: -0.7px

lead:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 22px
fontWeight: 400
lineHeight: 1.45
letterSpacing: -0.3px

body:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 17px
fontWeight: 400
lineHeight: 1.55
letterSpacing: -0.2px

body-strong:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 17px
fontWeight: 600
lineHeight: 1.45
letterSpacing: -0.2px

label:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 14px
fontWeight: 600
lineHeight: 1.3
letterSpacing: -0.1px

caption:
fontFamily: "Inter, system-ui, sans-serif"
fontSize: 13px
fontWeight: 500
lineHeight: 1.4
letterSpacing: 0

eyebrow:
fontFamily: "JetBrains Mono, monospace"
fontSize: 12px
fontWeight: 600
lineHeight: 1
letterSpacing: 0.08em
textTransform: uppercase

code:
fontFamily: "JetBrains Mono, monospace"
fontSize: 14px
fontWeight: 400
lineHeight: 1.5

---

## typography principles

* Hero typography is intentionally oversized.
* Headlines use tight negative tracking.
* Body copy remains comfortable and readable.
* 600–700 weights define hierarchy.
* 400 is reserved for descriptions and supporting content.
* Monospace is used only for technical metadata, numbers, labels and hackathon-specific UI.
* Avoid using more than three font weights inside one section.
* Never use decorative typography when the content itself can create hierarchy.

---

## rounded

none: 0px
xs: 6px
sm: 10px
md: 14px
lg: 20px
xl: 28px
pill: 9999px
full: 9999px

The system deliberately uses fewer radius values. Large cards use 20–28px. Interactive controls use pills or 10–14px compact geometry.

---

## spacing

xxs: 4px
xs: 8px
sm: 12px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
hero: 96px
section: 120px
section-large: 160px

Base rhythm: 8px.

Primary landing sections should generally use 96–160px vertical spacing. The objective is not maximum information density but strong visual pacing.

---

## layout

max-width:
desktop: 1280px
wide: 1440px

content-width:
text: 760px
narrow: 640px

desktop-gutter: 32px
tablet-gutter: 24px
mobile-gutter: 20px

grid-gap:
small: 12px
medium: 20px
large: 32px

The landing should feel spacious at desktop sizes while remaining dense enough on mobile to preserve momentum.

---

## navigation

### global-nav

backgroundColor: "rgba(255,255,255,0.72)"
backdropFilter: "blur(20px) saturate(180%)"
borderBottom: "1px solid rgba(0,0,0,0.06)"
height: 72px
padding: 0 32px
position: sticky

The navigation should visually float above the page rather than behave like a conventional SaaS navbar.

### nav-logo

typography: body-strong
color: ink

### nav-link

typography: label
color: ink-muted

### nav-link-active

typography: label
color: ink

### nav-cta

backgroundColor: primary
textColor: on-primary
rounded: pill
padding: 11px 20px

---

## hero

### hero-section

backgroundColor: canvas
minHeight: 760px
padding: 96px 32px 120px

Content is vertically centered.

The hero should contain:

1. Eyebrow
2. Massive headline
3. Short supporting statement
4. Primary CTA
5. Secondary CTA
6. Optional hackathon metadata
7. Visual proof / product preview

### hero-eyebrow

typography: eyebrow
color: primary

Recommended structure:

[HACKATHON 2026]
Build something that matters.

### hero-title

typography: hero-display
maxWidth: 920px
color: ink

### hero-description

typography: lead
maxWidth: 680px
color: ink-muted

### hero-actions

display: flex
gap: 12px
marginTop: 32px

---

## buttons

### button-primary

backgroundColor: primary
textColor: on-primary
typography: body-strong
rounded: pill
padding: 14px 24px
minHeight: 48px

### button-primary-hover

backgroundColor: primary-hover

### button-primary-active

backgroundColor: primary-active
transform: scale(0.97)

### button-secondary

backgroundColor: transparent
textColor: ink
border: 1px solid border-strong
typography: body-strong
rounded: pill
padding: 14px 24px
minHeight: 48px

### button-secondary-dark

backgroundColor: transparent
textColor: on-dark
border: 1px solid border-on-dark
typography: body-strong
rounded: pill
padding: 14px 24px

### button-icon

width: 44px
height: 44px
rounded: full
backgroundColor: canvas-muted
color: ink

---

## section-header

eyebrow:
typography: eyebrow
color: primary

title:
typography: display-lg
maxWidth: 800px

description:
typography: lead
maxWidth: 680px
color: ink-muted

marginBottom: 56px

---

## showcase-card

backgroundColor: canvas
border: 1px solid border
rounded: xl
padding: 32px

No default shadow.

Cards should gain hierarchy through surface contrast, spacing and borders rather than heavy elevation.

---

## feature-card

backgroundColor: canvas-soft
border: none
rounded: lg
padding: 32px

icon:
width: 48px
height: 48px
rounded: md
backgroundColor: primary-soft
color: primary

title:
typography: heading

description:
typography: body
color: ink-muted

---

## metric-card

backgroundColor: ink
color: on-dark
rounded: xl
padding: 32px

number:
fontFamily: Inter
fontSize: 48px
fontWeight: 700
lineHeight: 1
letterSpacing: -2px

label:
typography: label
color: on-dark-muted

Metric cards can use primary as a small accent indicator, but should not become visually saturated.

---

## code-card

backgroundColor: surface-dark
color: on-dark
rounded: xl
padding: 24px
border: 1px solid border-on-dark

Use JetBrains Mono.

Optional accent:

top-border: 2px solid primary

This component is particularly useful for a hackathon because it communicates technical credibility immediately.

---

## dark-section

backgroundColor: surface-dark
color: on-dark
padding: section-large 32px

Dark sections should act as visual resets between major landing chapters.

Use:

* white typography
* muted secondary text
* Electric Blue CTAs
* subtle borders
* technical metadata

Do not fill the entire dark section with blue.

---

## blue-section

backgroundColor: primary
color: on-primary
padding: section-large 32px

Use sparingly.

Recommended usage:

* final CTA
* announcement
* winner / result section
* major event statement

Avoid using Electric Blue as the default background for every section.

---

## glass-card

backgroundColor: rgba(255,255,255,0.72)
backdropFilter: blur(20px) saturate(180%)
border: 1px solid rgba(255,255,255,0.45)
rounded: xl

Use only for floating UI, navigation and overlays.

Do not turn the whole landing into glassmorphism.

---

## badge

backgroundColor: primary-soft
color: primary
typography: eyebrow
rounded: pill
padding: 8px 12px

Variants:

badge-dark:
backgroundColor: rgba(67,83,254,0.14)
color: primary-on-dark

badge-neutral:
backgroundColor: canvas-muted
color: ink-muted

---

## timeline

timeline-line:
width: 1px
backgroundColor: border

timeline-point:
width: 12px
height: 12px
rounded: full
backgroundColor: primary

timeline-active:
backgroundColor: primary
boxShadow: "0 0 0 6px rgba(67,83,254,0.12)"

Timeline items should remain visually simple. The information architecture is more important than decoration.

---

## footer

backgroundColor: surface-dark
color: on-dark
padding: 64px 32px

footer-heading:
typography: label
color: on-dark

footer-link:
typography: body
color: on-dark-muted

footer-meta:
typography: caption
color: on-dark-muted

---

## imagery

### Hero imagery

Preferred aspect ratios:

desktop: 16:9
wide: 21:9
mobile: 4:3

Images should be large, crisp and editorial.

Avoid:

* generic stock photos
* excessive rounded image containers
* decorative image borders
* gradients placed over every image

### Product / project screenshots

Use:

background: canvas-soft
rounded: xl
border: 1px solid border

Screenshots should be treated as evidence of the product, not decoration.

---

## elevation

The system intentionally uses minimal shadows.

shadow-none:
none

shadow-soft:
0 12px 40px rgba(11,13,23,0.08)

shadow-floating:
0 20px 60px rgba(11,13,23,0.12)

shadow-blue:
0 12px 40px rgba(67,83,254,0.18)

Use shadows only for floating objects, screenshots and important overlays.

Never use shadows on every card.

---

## interaction

### Hover

Buttons may increase visual contrast.

Primary:
backgroundColor: primary-hover

Secondary:
borderColor: primary
color: primary

### Active

All buttons:

transform: scale(0.97)

Duration:

120ms

### Focus

outline:
2px solid primary
outlineOffset: 3px

### Transition

transition:
160ms cubic-bezier(0.2, 0.8, 0.2, 1)

Animations should feel fast. This is a hackathon landing, not a cinematic portfolio.

---

## responsive

### Desktop

≥ 1200px

hero-display: 72px
section: 120–160px
grid: 3–4 columns
container: 1280px

### Tablet

768–1199px

hero-display: 56px
section: 96px
grid: 2 columns
container padding: 24px

### Mobile

≤ 767px

hero-display: 40px
display-lg: 32px
display-md: 28px
lead: 19px
section: 80px
grid: 1 column
container padding: 20px

### Small mobile

≤ 420px

hero-display: 34px
display-lg: 28px
lead: 18px
button: full width when appropriate

---

## landing architecture

Recommended page rhythm:

01 — Navigation

02 — Hero
Large statement + primary CTA + product/project visual.

03 — Problem
Why this hackathon / product matters.

04 — Solution
Core concept explained through 3–4 feature cards.

05 — Product Showcase
Large screenshot / prototype / demo.

06 — How It Works
Three to five sequential steps.

07 — Technology
Dark technical section with stack, architecture or implementation.

08 — Metrics
Large numbers, results, users, teams, time saved or impact.

09 — Team
Minimal team presentation.

10 — Final CTA
Electric Blue or dark high-contrast section.

11 — Footer

---

## visual language

The visual language is:

fast
technical
confident
editorial
minimal
competitive
high-contrast
product-first

The landing should feel like a product that is already real, not a presentation about an idea.

---

## design principles

1. Electric Blue is the only primary interaction color.

2. Use color to create hierarchy, not decoration.

3. Large typography communicates confidence.

4. Dark sections create visual resets.

5. White space creates premium perception.

6. Screenshots and prototypes are treated as product evidence.

7. Cards should not look like generic SaaS cards.

8. Avoid excessive gradients.

9. Avoid excessive shadows.

10. Avoid unnecessary glassmorphism.

11. Use monospace typography only for technical context.

12. Primary CTA should always be immediately recognizable.

13. Every section should have one clear message.

14. Every viewport should have a visual focal point.

15. The design should remain understandable without animation.

---

## do

* Use #4353FE consistently.
* Use large editorial headlines.
* Use dark sections for technical/product content.
* Use rounded 20–28px cards for major content blocks.
* Use pill buttons for primary actions.
* Use screenshots as hero visuals.
* Use subtle borders instead of heavy shadows.
* Use JetBrains Mono for code, dates, tags and technical metadata.
* Keep section layouts simple.
* Prioritize the product over decoration.

---

## don't

* Don't introduce another brand accent.
* Don't use purple, cyan, pink or green as competing brand colors.
* Don't use rainbow gradients.
* Don't put a shadow on every card.
* Don't use 5–6 different border radii.
* Don't make every section blue.
* Don't overload the hero with text.
* Don't use tiny body text for important information.
* Don't create decorative UI that has no informational purpose.
* Don't make the landing look like a generic Bootstrap/SaaS template.

---

## signature visual

The signature composition of the system is:

LIGHT HERO
↓
DARK PRODUCT / TECHNOLOGY SECTION
↓
LIGHT FEATURE GRID
↓
DARK SHOWCASE
↓
LIGHT METRICS
↓
ELECTRIC BLUE FINAL CTA
↓
DARK FOOTER

This creates a visual rhythm without requiring gradients or excessive animation.

---

## brand color rule

#4353FE should appear frequently enough to establish recognition but rarely enough to remain valuable.

Recommended approximate usage:

Primary brand: 5–10%
Neutral surfaces: 70–80%
Dark surfaces: 15–25%
Secondary status colors: <5%

The goal is not a blue website.

The goal is a neutral, editorial website where Electric Blue immediately means:

ACTION
TECHNOLOGY
PROGRESS
JOIN
BUILD
WIN

---

## core tokens

primary: #4353FE
ink: #0B0D17
canvas: #FFFFFF
canvas-soft: #F7F8FC
surface-dark: #0B0D17
border: #E4E6EF
primary-soft: #EEF0FF

hero-display: 72px / 700 / -3.2px
display-xl: 56px / 700 / -2.4px
display-lg: 44px / 700 / -1.8px
lead: 22px / 400 / 1.45
body: 17px / 400 / 1.55

radius-card: 28px
radius-control: 9999px

section: 120px
container: 1280px

primary-action: #4353FE
