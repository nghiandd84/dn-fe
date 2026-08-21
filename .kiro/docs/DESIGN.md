---
version: alpha
name: DN Admin Suite
description: Design system for the DN frontend monorepo — a suite of internal admin tools built with SvelteKit. The aesthetic is professional, functional, and dense, prioritising clarity and information density over visual ornamentation.
colors:
  primary: "#4f46e5"
  primary-dark: "#4338ca"
  primary-light: "#eef2ff"
  primary-muted: "#c7d2fe"
  sidebar-bg: "#1e1b4b"
  sidebar-accent: "#3730a3"
  surface: "#ffffff"
  background: "#f5f5f5"
  border: "#e5e7eb"
  border-light: "#f3f4f6"
  text: "#1a1a1a"
  text-secondary: "#374151"
  text-muted: "#6b7280"
  text-faint: "#9ca3af"
  error: "#dc2626"
  error-bg: "#fee2e2"
  error-muted: "#fca5a5"
  success: "#15803d"
  success-bg: "#dcfce7"
  success-muted: "#6ee7b7"
  warning: "#a16207"
  warning-bg: "#fef9c3"
  info: "#1d4ed8"
  info-bg: "#dbeafe"
  admin: "#7e22ce"
  admin-bg: "#f3e8ff"
typography:
  base:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
  label-sm:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.03em
  heading-sm:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 17.6px
    fontWeight: 600
    lineHeight: 1.3
  heading-md:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  sidebar-width: 220px
  content-padding: 32px
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 0.7rem 1rem
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 0.7rem 1rem
  button-secondary-hover:
    backgroundColor: "{colors.primary-light}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 0.6rem
  badge-read:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
    rounded: 3px
  badge-create:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    rounded: 3px
  badge-update:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    rounded: 3px
  badge-delete:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error}"
    rounded: 3px
  badge-admin:
    backgroundColor: "{colors.admin-bg}"
    textColor: "{colors.admin}"
    rounded: 3px
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  sidebar:
    backgroundColor: "{colors.sidebar-bg}"
    textColor: "{colors.surface}"
    width: 220px
---

# DN Admin Suite

A suite of internal admin tools for managing platform resources: users, profiles, bookings, events, email templates, translations, URL shortcuts, and lookup data. The visual language is **utilitarian and precise** — designed for operators who spend long sessions in dense data interfaces.

The UI prioritises legibility and predictability. Interactions are explicit, states are clearly signalled, and the layout is stable. Decorative elements are kept to a minimum.

## Overview

Each admin app is a standalone SvelteKit application sharing a common `@dn-fe/ui` component library and CSS toolkit. All apps share the same visual language to create a coherent internal tooling experience.

The brand is professional and institutional. The indigo primary color (#4f46e5) provides a trustworthy and focused tone. The deep navy sidebar (#1e1b4b) anchors the layout and separates navigation from content. Backgrounds are intentionally neutral (near-white) to give content maximum contrast.

## Colors

The palette uses a single indigo accent anchored against neutral grays, with semantic colors reserved strictly for status communication.

- **Primary (#4f46e5):** Indigo used for interactive controls — buttons, links, active states, and focus rings. Conveys reliability and focus.
- **Primary Dark (#4338ca):** Hover/pressed state for primary interactive elements.
- **Primary Light (#eef2ff):** Subtle backgrounds for hover states on secondary buttons and selected nav items.
- **Primary Muted (#c7d2fe):** Used for de-emphasised text in the dark sidebar.
- **Sidebar Background (#1e1b4b):** Deep navy for the fixed navigation sidebar. Creates a visual anchor distinct from content areas.
- **Sidebar Accent (#3730a3):** Hover state background inside the sidebar nav.
- **Surface (#ffffff):** Card and modal backgrounds.
- **Background (#f5f5f5):** Page-level background — a barely-there off-white.
- **Border (#e5e7eb):** Standard dividers and input borders.
- **Text (#1a1a1a):** Near-black for all primary content.
- **Text Secondary (#374151):** Panel headers and slightly de-emphasised content.
- **Text Muted (#6b7280):** Captions, secondary descriptions, placeholder text.
- **Error (#dc2626):** Destructive actions, validation errors.
- **Success (#15803d):** Confirmation states, create/assign actions.
- **Warning (#a16207):** Update/edit action indicators.
- **Info (#1d4ed8):** Read/view permission indicators.
- **Admin (#7e22ce):** Super-admin permission level badge.

## Typography

A system font stack is used across all apps for fast rendering and native feel. No web fonts are loaded.

- **Base (16px/400):** Default body text across all content areas.
- **Body SM (14px/400):** Table cell content, form helper text.
- **Label (13px/500):** Form labels, nav items, column headers.
- **Label SM (12px/500):** Sidebar nav items, metadata rows.
- **Caption (11px/700, uppercase, tracked):** Action badges and permission type tags.
- **Heading SM (1.1rem/600):** Sidebar app title, card subheadings.
- **Heading MD (24px/600):** Page-level headings.

## Layout

The layout follows a **fixed sidebar + fluid content** pattern. All admin apps use a two-column layout: a fixed 220px navigation sidebar on the left, and a scrollable content area to the right.

- Sidebar: 220px fixed, full viewport height, dark navy background
- Content area: flexible width, 2rem padding on all sides
- Tables span the full content width with horizontal scroll for overflow
- Auth and error pages use a centered card layout (max 400px) on a neutral background

```
┌──────────┬─────────────────────────────────┐
│ Sidebar  │  Content Area                   │
│  220px   │  flex:1, padding: 2rem          │
│  navy    │  background: #f5f5f5            │
└──────────┴─────────────────────────────────┘
```

## Elevation & Depth

Depth is used sparingly. The auth card uses a single subtle box shadow (`0 2px 8px rgba(0,0,0,0.1)`) to lift it off the background. Admin content panels use only borders, not shadows, to maintain visual flatness appropriate for dense data display.

Permission panels and data tables rely on border-based containment (`1px solid #e5e7eb`) rather than shadow stacking.

## Shapes

All interactive elements use **4px corner radius** (`rounded.sm`) as the default — inputs, buttons, badges, and small controls. Cards and panels use **8px** (`rounded.lg`). Pill-shaped elements (count badges, tag chips) use `9999px` (`rounded.full`).

Sharp geometry is intentional: the UI is an operator tool, not a consumer product.

## Components

### Buttons

- **Primary:** Solid indigo (#4f46e5), white text, 4px radius. Used for the main action per form.
- **Primary hover:** Darkens to #4338ca.
- **Secondary (outline):** White background, indigo border and text. Used for supporting actions.
- **Secondary hover:** Light indigo tint (#eef2ff) background.
- Submit buttons span full width within forms.

### Input Fields

- Full-width within their container
- 0.6rem padding, 1px solid #ddd border, 4px radius
- Error state: border turns red (#dc2626), error message below in red

### Action Badges

Compact uppercase labels used in tables and detail views to communicate permission types and CRUD operation categories:

- **READ:** Blue tint (#dbeafe / #1d4ed8)
- **CREATE:** Green tint (#dcfce7 / #15803d)
- **UPDATE:** Yellow tint (#fef9c3 / #a16207)
- **DELETE:** Red tint (#fee2e2 / #dc2626)
- **ADMIN:** Purple tint (#f3e8ff / #7e22ce)

Font: 10.4px (0.65rem), 700 weight, uppercase, 0.03em letter-spacing, 3px radius.

### Sidebar Navigation

- 220px wide, full-height, deep navy background (#1e1b4b)
- App title: 1.1rem semi-bold, white, with indigo bottom border (#3730a3)
- Nav links: muted periwinkle (#c7d2fe), 4px radius, 0.5rem vertical / 0.7rem horizontal padding
- Active/hover: dark indigo background (#3730a3), white text
- Footer area: displayed at bottom via flex column layout

### Cards (Auth & Modal)

- White background, 8px radius, `0 2px 8px rgba(0,0,0,0.1)` shadow
- 2rem internal padding
- Max-width 400px for auth/error cards

### Toast Notifications

Transient feedback messages. Positioned fixed, typically bottom-right or top-right.

## Do's and Don'ts

- Do use #4f46e5 (primary) only for the single most important action per view
- Do use semantic badge colors consistently — never repurpose error red for non-error states
- Don't use box shadows inside the admin content area; rely on borders for separation
- Don't introduce web fonts — the system font stack is intentional for performance
- Do maintain WCAG AA contrast: 4.5:1 for body text, 3:1 for large text and UI components
- Don't mix 4px and 8px corner radii on sibling elements within the same component
- Do use uppercase + letter-spacing only for action badges and compact labels, not body copy
- Don't add decorative color to the sidebar beyond the defined navy/indigo palette


