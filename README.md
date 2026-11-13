# design-system

Design tokens for [wonmor.io](https://wonmor.io), packaged as `@wonmor/tokens`.

| Path | What |
|---|---|
| [`tokens/tokens.css`](tokens/tokens.css) | CSS custom properties on `:root`, responsive overrides, two theme classes and `@font-face` rules |
| [`tokens/tokens.json`](tokens/tokens.json) | The same values as JSON, for tools and other platforms |

**Status.** Version 0.1.0. The package is named `@wonmor/tokens`, but it is **not published to npm yet**. Components (button, card, header, footer) are **planned**; nothing is published for them yet.

## Usage

Copy or vendor the file, or install from git (until the package is on npm):

```bash
npm install github:wonmortech/design-system
```

```css
@import "@wonmor/tokens/tokens.css";

body {
  font-family: var(--sans);
  font-size: var(--fs-body-3);
  background: var(--theme-background-primary);
  color: var(--theme-foreground-primary);
}

.card {
  background: var(--theme-background-secondary);
  border: 1px solid var(--theme-border-secondary);
  border-radius: var(--radius-card);
  transition: transform 400ms var(--ease-out-quart);
}

/* A dark band: the class only swaps the semantic tokens, so set background and colour yourself. */
.theme-slate {
  background: var(--theme-background-primary);
  color: var(--theme-foreground-primary);
}
```

Rules the site follows:

- Components use the semantic `--theme-*` tokens, never raw `--gray-*` values or hex. That is what makes `.theme-slate` and `.theme-ivory-medium` work on any subtree.
- `--ill-*` colours are for illustrations only, never for UI chrome.
- `--wm-*` colours are for the Wonmor logo only.

## Main tokens

### Colour

| Token | Value | Use |
|---|---|---|
| `--gray-000` … `--gray-950` | `#ffffff` … `#141413` (20 steps) | Neutral scale; referenced by the theme tokens |
| `--theme-background-primary` | `--gray-050` `#faf9f5` | Page background |
| `--theme-background-secondary` | `--gray-100` `#f5f4ed` | Cards, raised areas |
| `--theme-foreground-primary` | `--gray-950` `#141413` | Body text |
| `--theme-foreground-secondary` | `--gray-750` `#30302e` | Secondary text |
| `--theme-foreground-tertiary` | `--gray-600` `#5e5d59` | Captions, metadata |
| `--theme-border-primary` | `--gray-350` `#c2c0b6` | Strong borders |
| `--theme-button-primary-background` | `--gray-950` `#141413` | Primary button |
| `--theme-focus-ring` | `#154c92` (`#8fb4ec` in `.theme-slate`) | Keyboard focus |
| `--wm-blue` / `--wm-ink` | `#2969FF` / `#090A1E` | Logo only |
| `--ill-*` | oat, olive, cactus, sky, heather, coral, gold, lapis, clay | Illustrations only |

`.theme-slate` inverts the scale (background `#141413`, text `#faf9f5`); `.theme-ivory-medium` uses a slightly darker ivory background (`#f0eee6`). All overrides are listed in `tokens.json` under `theme`.

### Type scale

Fluid sizes interpolate linearly between a 390 px and a 1920 px viewport.

| Token | 390 px | 1920 px |
|---|---|---|
| `--fs-headline-1` | 48px | 80px |
| `--fs-headline-2` | 40px | 71px |
| `--fs-display` | 32px | 61px |
| `--fs-subheadline-1` | 30px | 48px |
| `--fs-manifest` | 25px | 48px |
| `--fs-subheadline-2` | 25px | 36px |
| `--fs-subheadline-3` | 22px | 28px |
| `--fs-headline-5` | 19px | 25px |
| `--fs-body-1` | 20px | 22px |
| `--fs-body-2` | 18px | 20px |
| `--fs-body-3` | 16px | 17px |
| `--fs-body-4` | 14px | 15px |
| `--fs-caption-1` | 13px | 13px |
| `--fs-caption-2` | 11px | 11px |

Font stacks: `--sans` (Wm Sans), `--serif` (Wm Serif), `--mono` (Wm Mono), each with system fallbacks.

### Spacing and layout

| Token | < 768 px | ≥ 768 px | ≥ 1280 px |
|---|---|---|---|
| `--grid-columns` | 4 | 12 | 12 |
| `--grid-margin` | 32px | 48px | 80px |
| `--grid-gutter` | 16px | 16px | 16px |
| `--page-top-spacer` | 48px | 64px | 80px |
| `--section-spacer-sm` | 32px | 40px | 48px |
| `--section-spacer-lg` | 64px | 80px | 96px |

Fixed: `--grid-max-width: 1920px`, `--header-nav-height: 84px`, `--reading-width: 660px`.

### Radius

| Token | Value |
|---|---|
| `--radius-media` | 4px |
| `--radius-card` | 16px |

### Easing

| Token | Value |
|---|---|
| `--ease-out-quart` | `cubic-bezier(.165, .84, .44, 1)` |
| `--ease-in-out-quart` | `cubic-bezier(.77, 0, .175, 1)` |
| `--ease-rise` | `cubic-bezier(.16, 1, .3, 1)` |
| `--ease-opacity` | `cubic-bezier(.2, .7, .1, 1)` |
| `--ease-scrim` | `cubic-bezier(.33, 1, .68, 1)` |
| `--ease-swap` | `cubic-bezier(.25, 1, .5, 1)` |
| `--ease-icon` | `cubic-bezier(.2, .8, .2, 1)` |
| `--ease-panel` | `cubic-bezier(.4, 0, .2, 1)` |

## Fonts

Font files are **not included**. `tokens.css` declares `@font-face` rules that load files from `../fonts/` relative to `tokens/tokens.css`. To use them, put these files in a `fonts/` folder next to `tokens/`; without them the stacks fall back to system fonts. All four families are open fonts under the [SIL Open Font License 1.1](https://openfontlicense.org/):

| Family in CSS | Font | Files expected | Licence |
|---|---|---|---|
| Wm Sans (Latin) | [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk), © 2021 The Hanken Grotesk Project Authors | `sans-latin.woff2`, `sans-latin-ext.woff2` | OFL 1.1 |
| Wm Sans (Cyrillic) | [Onest](https://github.com/simpals/onest), © 2021 The Onest Project Authors | `sans-cyrillic.woff2`, `sans-cyrillic-ext.woff2` | OFL 1.1 |
| Wm Serif | Source Serif 4, © Google Inc. | `serif-latin.woff2`, `serif-latin-ext.woff2`, `serif-cyrillic.woff2`, `serif-latin-italic.woff2` | OFL 1.1 |
| Wm Mono | [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), © 2020 The JetBrains Mono Project Authors | `mono-latin.woff2`, `mono-cyrillic.woff2` | OFL 1.1 |

wonmor.io takes the variable-font subsets from the `@fontsource-variable/hanken-grotesk`, `@fontsource-variable/onest`, `@fontsource-variable/source-serif-4` and `@fontsource-variable/jetbrains-mono` npm packages and renames them to the file names above. If you redistribute the fonts, include each font's OFL licence text.

## Licence

Tokens and documentation: [MIT](LICENSE). The fonts are not part of this repository and keep their own licence (OFL 1.1).
