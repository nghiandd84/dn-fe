---
inclusion: fileMatch
globs:
  - "**/*.svelte"
  - "**/routes/**"
  - "**/lib/**/*.svelte"
  - "**/styles/**/*.css"
  - "**/app.html"
---

# UI Design System

When generating, editing, or reviewing any UI component, page, or stylesheet in this project, you MUST read and follow `.kiro/docs/DESIGN.md`.

## Rules

1. **Read DESIGN.md first.** Before writing any UI code, read `.kiro/docs/DESIGN.md` to extract the relevant tokens (colors, typography, spacing, rounded, components).

2. **Use the defined color tokens.** Never introduce new hex values. All colors must come from the `colors` section of DESIGN.md. Use CSS variables or inline values that match exactly.

3. **Use the defined typography scale.** Font sizes, weights, families, and line heights must match the `typography` tokens. The font stack is always `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` — do not load web fonts.

4. **Use the defined spacing tokens.** Padding and margin values must align with the `spacing` scale: `4px, 8px, 16px, 24px, 32px, 48px`.

5. **Use the defined border-radius tokens.** Default to `4px` (rounded.sm) for interactive elements (buttons, inputs, badges). Use `8px` (rounded.lg) for cards and panels. Use `9999px` (rounded.full) for pill badges only.

6. **Follow the layout pattern.** All admin apps use a fixed 220px sidebar (dark navy `#1e1b4b`) + fluid content area (`flex:1`, `padding: 2rem`, background `#f5f5f5`). Auth/error pages use a centered card (max-width 400px, white, 8px radius, subtle shadow).

7. **Use the correct button variants.** Primary buttons: solid indigo `#4f46e5`, white text. Secondary buttons: white background, indigo border and text. Never deviate from these patterns.

8. **Use semantic badge colors correctly.** Action badges follow the fixed palette from DESIGN.md: read=blue, create=green, update=yellow, delete=red, admin=purple. Do not repurpose these colors for other meanings.

9. **No decorative additions.** Do not add gradients, animations, additional shadows, or colors not in DESIGN.md unless the user explicitly requests it.

10. **Maintain WCAG AA contrast.** All text must meet 4.5:1 contrast against its background. Use the error color `#dc2626` only for destructive actions and validation errors.
