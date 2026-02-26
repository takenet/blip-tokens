# blip-tokens

Blip Design Tokens — the single source of truth for UI attributes (colors, spacing, typeface, icons, illustrations, etc.) consumed by the Blip Design System.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Design Tokens](#design-tokens)
- [Icons](#icons)
  - [Adding New Icons](#adding-new-icons)
  - [Icon Script (generate_icons)](#icon-script-generate_icons)
  - [Icon TypeScript Types (generate_icon_types)](#icon-typescript-types-generate_icon_types)
  - [Importing Icons in Your Project](#importing-icons-in-your-project)
- [Illustrations](#illustrations)
- [Emojis](#emojis)
- [Logos](#logos)
- [Build](#build)
- [Build Outputs](#build-outputs)
- [CI/CD](#cicd)
- [Contributing](#contributing)


## Project Structure

```
blip-tokens/
├── assets/                        # Raw SVG source files
│   ├── emojis/
│   ├── icons/
│   │   ├── outline/               # Outline-style icons (.svg)
│   │   └── solid/                 # Solid-style icons (.svg)
│   │       └── flags/             # Flag icons (sub-folder)
│   ├── illustrations/             # Illustration categories (blip-outline, brand, default, …)
│   └── logos/
├── properties/                    # Style Dictionary token source files
│   └── assets/
│       ├── icons.json             # Icon registry (name → SVG path)
│       ├── emojis.json            # Emoji registry
│       ├── illustrations.json     # Illustration registry
│       ├── logos.json             # Logo registry
│       ├── variables.json         # Color palette tokens
│       ├── theme-light.json       # Light theme semantic tokens
│       ├── theme-dark.json        # Dark theme semantic tokens
│       ├── theme-high-contrast.json
│       └── extended-color.json    # Extended color palette
├── scripts/
│   ├── generate_icons.cjs         # Sync SVGs → icons.json registry
│   └── generate_icon_types.js     # Generate TS types from filesystem
├── config.cjs                     # Style Dictionary configuration
├── build/                         # Generated output (git-ignored)
├── docs/                          # Architecture Decision Records
└── package.json
```

---

## Design Tokens

Token source files live in `properties/assets/`. Style Dictionary transforms them into multiple output formats during the build step.

| Source File | Description |
|---|---|
| `variables.json` | Base color palette (`primary-main`, `primary-dark`, …) |
| `theme-light.json` | Light theme semantic tokens (`brand`, `surface-1`, `content-default`, …) |
| `theme-dark.json` | Dark theme semantic tokens |
| `theme-high-contrast.json` | High contrast theme tokens |
| `extended-color.json` | Extended color set (`blue`, `ocean`, `green`, `yellow`, …) |

---

## Icons

Icons are SVG files stored in `assets/icons/`. During the build, they are converted to **base64** and output as a single JSON file.

There are two icon variants:

| Variant | Directory | Naming convention in `icons.json` |
|---|---|---|
| **Outline** | `assets/icons/outline/` | `<name>-outline` |
| **Solid** | `assets/icons/solid/` | `<name>-solid` |

### Adding New Icons

1. **Place the SVG file** in the correct folder:
   - Outline icons → `assets/icons/outline/`
   - Solid icons → `assets/icons/solid/`
   - (Sub-folders like `solid/flags/` are supported)

2. **Register the icon** in `properties/assets/icons.json`:

   ```json
   "icon-name-outline": {
     "value": "assets/icons/outline/icon-name.svg"
   }
   ```

   Or for solid:

   ```json
   "icon-name-solid": {
     "value": "assets/icons/solid/icon-name.svg"
   }
   ```

   > The list is organized alphabetically, with all outline icons first, then all solid icons.

3. **Or use the automated script** (recommended):

   ```bash
   cd scripts
   node generate_icons.cjs
   ```

   The script scans `assets/icons/`, detects unregistered SVGs, and interactively prompts you to add them to `icons.json`. It also sorts the file automatically.

4. **Build** to generate the base64 output and TypeScript types:

   ```bash
   npm run build
   ```

### Icon Script (`generate_icons`)

**File:** `scripts/generate_icons.cjs`

This CommonJS script:
- Recursively scans `assets/icons/` for `.svg` files
- Compares found files against `properties/assets/icons.json`
- Reports files that are missing from the registry or that reference missing SVGs
- Interactively asks whether to add unregistered files
- Auto-generates the key using the convention `<filename>-<variant>` (e.g. `add-outline`, `heart-solid`)
- Sorts the resulting JSON (outline first, then solid, both alphabetically)

### Icon TypeScript Types (`generate_icon_types`)

**File:** `scripts/generate_icon_types.js`

This ESM script runs automatically at the end of `npm run build`. It:
- Scans the filesystem (`assets/icons/outline/` and `assets/icons/solid/`) directly
- Generates `build/icons.js` with runtime arrays (`OutlineIcons`, `SolidIcons`, `AllIcons`) and helper functions (`isOutlineIcon`, `isSolidIcon`, `isValidIcon`)
- Generates `build/icons.d.ts` with TypeScript type definitions (`OutlineIcon`, `SolidIcon`, `IconName`)

### Importing Icons in Your Project

#### Runtime arrays

```typescript
import { OutlineIcons, SolidIcons, AllIcons } from 'blip-tokens/icons';

console.log(OutlineIcons); // ["123", "ab", "add", ...]
console.log(SolidIcons);   // ["add", "attention", ...]
console.log(AllIcons);     // Union of both, deduplicated
```

#### TypeScript types

```typescript
import type { OutlineIcon, SolidIcon, IconName } from 'blip-tokens/icons';

function renderIcon(name: OutlineIcon) {
  // TypeScript validates and auto-completes icon names
}
```

#### Helper functions

```typescript
import { isOutlineIcon, isSolidIcon, isValidIcon } from 'blip-tokens/icons';

if (isValidIcon(userInput)) {
  // Safe to use
}
```

> See [AD-003](docs/ad/003-icon-type-exports.md) for full usage examples (React components, dynamic pickers, form validation).

---

## Illustrations

Illustration SVGs live in `assets/illustrations/` organized by category (`default`, `brand`, `blip-outline`, `blip-solid`, `empty-states`, `screens`, `segmented`, `smartphone`, `spots`, `logo-integration`).

Registry: `properties/assets/illustrations.json`

During build, each category is output as a separate JSON file under `build/json/illustrations/<category>/`.

---

## Emojis

Emoji SVGs live in `assets/emojis/`.

Registry: `properties/assets/emojis.json`

---

## Logos

Logo SVGs live in `assets/logos/`.

Registry: `properties/assets/logos.json`

---

## Build

```bash
npm run build
```

The build process runs two steps:

1. **Style Dictionary** (`config.cjs`) — transforms all token source files in `properties/` into build outputs
2. **Icon types generator** (`scripts/generate_icon_types.js`) — produces `build/icons.js` and `build/icons.d.ts`

### Build Outputs

```
build/
├── css/
│   └── classes.css            # CSS utility classes (.color-*, .bg-*)
├── scss/
│   ├── variables.scss         # Color palette as SCSS variables
│   ├── theme-light.scss
│   ├── theme-dark.scss
│   ├── theme-high-contrast.scss
│   └── extended-color.scss
├── json/
│   ├── variables.json         # Flat JSON of all tokens
│   ├── assets_icons.json      # Icons as base64
│   ├── assets_emojis.json     # Emojis as base64
│   ├── assets_logos.json      # Logos as base64
│   ├── colors.json
│   ├── theme-light.json
│   ├── theme-dark.json
│   ├── theme-high-contrast.json
│   ├── extended-color.json
│   └── illustrations/         # Per-category illustration JSONs
├── icons.js                   # Runtime icon arrays + helpers
├── icons.d.ts                 # TypeScript type definitions
└── index.js                   # Main entry point
```

---

## CI/CD

- **Workflow:** `.github/workflows/nodejs.yml`
- **Trigger:** Push to `master`
- **Steps:** Checkout → Node 24 setup → `npm install` → `npm run build` → Semantic Release
- **Publish:** Automated via [Semantic Release](https://github.com/semantic-release/semantic-release) to npm

---

## Contributing

1. Follow [Conventional Commits](https://www.conventionalcommits.org/) — the release process depends on it
2. PR titles must use the correct type prefix (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
3. When adding icons, prefer using the `generate_icons.cjs` script to keep `icons.json` consistent
4. Always run `npm run build` locally to verify your changes produce valid outputs
5. The `build/` directory is git-ignored — never commit it
