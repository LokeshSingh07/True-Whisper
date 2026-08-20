# Theme Configuration Guide

Your project now uses a centralized theme system with **light and dark mode support**. All colors are defined in one place: [`src/app/theme.css`](src/app/theme.css)

## How to Change Colors

Edit the color values at the top of `src/app/theme.css`. All colors use the **OKLCH color format**.

### Current Theme: Blue

**Light Theme Colors:**
- Primary: `oklch(0.5 0.15 260)` - Blue
- Secondary: `oklch(0.9 0.08 260)` - Light Blue
- Accent: `oklch(0.7 0.12 260)` - Medium Blue

**Dark Theme Colors:**
- Primary: `oklch(0.6 0.2 260)` - Bright Blue
- Secondary: `oklch(0.3 0.08 260)` - Dark Blue
- Accent: `oklch(0.5 0.15 260)` - Medium Blue

## Understanding OKLCH Format

`oklch(lightness saturation hue)`

- **Lightness** (0-1): 0 = black, 1 = white
- **Saturation** (0-0.4): Higher = more vibrant
- **Hue** (0-360°): The color angle
  - 260° = Blue (current)
  - 0° / 360° = Red
  - 60° = Yellow
  - 120° = Green
  - 180° = Cyan
  - 300° = Purple

## Quick Color Suggestions

Replace `260` in the hue values with these to change themes:

- **Green Theme**: Use hue `120`
- **Purple Theme**: Use hue `300`
- **Red Theme**: Use hue `0` or `360`
- **Orange Theme**: Use hue `45`
- **Pink Theme**: Use hue `330`

## Example: Change to Green Theme

1. Open `src/app/theme.css`
2. Replace all `260` with `120` in the hue values
3. Save the file - changes apply instantly!

## Structure

```
--light-primary: oklch(0.5 0.15 260)  ← Change this
--light-secondary: oklch(0.9 0.08 260) ← And this
--dark-primary: oklch(0.6 0.2 260)    ← And this
... etc
```

The theme automatically applies to:
- ✅ Buttons
- ✅ Cards
- ✅ Inputs
- ✅ Navbar & Sidebar
- ✅ All UI Components
- ✅ Dark/Light mode switching

## System Preference vs Forced Dark Mode

The theme respects your system settings:
- If your OS is in dark mode → Dark theme applies
- If your OS is in light mode → Light theme applies
- The `.dark` class forces dark mode if needed

Enjoy your new blue theme! 🎨
