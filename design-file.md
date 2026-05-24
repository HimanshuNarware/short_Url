 CraftURL UI Technical Specification

This document details the text and CSS properties for the **CraftURL** interface, specifically focusing on the Minecraft-inspired gamified dashboard ({{DATA:SCREEN:SCREEN_2}}).

## 1. Visual Identity & Theme
*   **Theme Name:** Block & Link
*   **Color Mode:** Dark
*   **Aesthetic:** High-contrast, pixel-inspired, "Command Block" technical feel.
*   **Core Color:** `#5aa02c` (Slime Green / Minecraft Grass)

## 2. Typography
*   **Primary Font:** `Space Grotesk` (Sans-serif)
*   **Secondary Font:** `Monospace` (for technical logs and URL paths)
*   **Font Scales:**
    *   **Headline Large:** 32px - 48px (Used for "CRAFT NEW LINK")
    *   **Headline Small:** 18px - 24px (Used for section titles like "Recent Crafting")
    *   **Label Large:** 14px (Used for navigation items and button labels)
    *   **Body Medium:** 16px (Used for descriptions and hints)

## 3. Color Palette (Tokens)
| Token | Value | Usage |
| :--- | :--- | :--- |
| `surface` | `#141315` | Main background color |
| `surface-container` | `#1c1b1e` | Card and sidebar backgrounds |
| `primary` | `#5aa02c` | Brand color, main buttons, active states |
| `on-surface` | `#FFFFFF` | Primary text color |
| `on-surface-variant`| `#A19FA3` | Secondary/hint text |
| `accent-gold` | `#FFC107` | XP and high-value metric highlights |
| `accent-cyan` | `#00BCD4` | Bio-reach and geographic metrics |

## 4. UI Component Styles (Tailwind/CSS)

### Layout & Containers
*   **Sidebar:** `w-64 h-full bg-surface-container-high border-r-block-border border-on-surface`
*   **Main Wrapper:** `bg-surface p-gutter space-y-8`
*   **Cards:** `bg-surface-container border-2 border-on-surface shadow-flat`

### Buttons & Inputs
*   **Craft Button:** `bg-primary text-surface font-bold uppercase py-4 px-8 hover:brightness-110 active:translate-y-1 transition-all`
*   **URL Input:** `bg-surface-container-lowest border-2 border-on-surface text-on-surface p-4 font-mono focus:ring-2 focus:ring-primary`

### Specialized Elements
*   **Progress Bars:** `h-2 w-full bg-surface-bright rounded-none` with inner `bg-primary` or metric-specific color.
*   **Borders:** Most elements use a 2px or 4px solid border to simulate the blocky Minecraft aesthetic.
*   **Shadows:** "Flat" shadows (typically `4px 4px 0px rgba(0,0,0,1)`) are used instead of soft blurs.

## 5. Global CSS Logic
```css
/* Pixelated Border Effect */
.block-border {
  border: 4px solid var(--on-surface);
  box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
}

/* Minecraft-style button interaction */
.mc-button:active {
  transform: translateY(2px);
  box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
}
```