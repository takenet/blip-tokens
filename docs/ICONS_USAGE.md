# Icon Types Usage Guide

## Overview

The `blip-tokens` package now exports TypeScript-safe icon names extracted directly from the filesystem. This ensures your icon references are always in sync with the actual SVG files available.

## Installation

```bash
npm install blip-tokens
```

## Import Options

### Runtime Arrays

```typescript
import { OutlineIcons, SolidIcons, AllIcons } from 'blip-tokens/icons';

// Use in your application
console.log(OutlineIcons);  // ["add", "edit", "delete", ...]
console.log(SolidIcons);    // ["add", "attention", ...]
console.log(AllIcons);      // ["add", "attention", "delete", ...]
```

### TypeScript Types

```typescript
import type { OutlineIcon, SolidIcon, IconName } from 'blip-tokens/icons';

// Type-safe icon names
function renderIcon(name: OutlineIcon) {
  // TypeScript will autocomplete and validate icon names
  return `<icon name="${name}" />`;
}

renderIcon("add");     // ✅ Valid
renderIcon("invalid"); // ❌ TypeScript error
```

### Helper Functions

```typescript
import { isOutlineIcon, isSolidIcon, isValidIcon } from 'blip-tokens/icons';

// Runtime validation
if (isOutlineIcon("add")) {
  console.log("This icon exists in outline set");
}

if (isSolidIcon("attention")) {
  console.log("This icon exists in solid set");
}

if (isValidIcon("sparkle-ai")) {
  console.log("This icon exists in either set");
}
```

## Usage Examples

### React Component

```tsx
import type { OutlineIcon, SolidIcon } from 'blip-tokens/icons';

interface IconProps {
  name: OutlineIcon | SolidIcon;
  variant: 'outline' | 'solid';
}

export function Icon({ name, variant }: IconProps) {
  const iconData = getIconData(name, variant);
  return <img src={iconData} alt={name} />;
}

// Usage with autocomplete
<Icon name="add" variant="outline" />
<Icon name="attention" variant="solid" />
```

### Dynamic Icon Picker

```tsx
import { OutlineIcons, SolidIcons } from 'blip-tokens/icons';
import type { IconName } from 'blip-tokens/icons';
import { useState } from 'react';

export function IconPicker() {
  const [selected, setSelected] = useState<IconName | null>(null);
  
  return (
    <div>
      <h3>Outline Icons ({OutlineIcons.length})</h3>
      <div className="icon-grid">
        {OutlineIcons.map(name => (
          <button key={name} onClick={() => setSelected(name)}>
            {name}
          </button>
        ))}
      </div>
      
      <h3>Solid Icons ({SolidIcons.length})</h3>
      <div className="icon-grid">
        {SolidIcons.map(name => (
          <button key={name} onClick={() => setSelected(name)}>
            {name}
          </button>
        ))}
      </div>
      
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}
```

### Form Validation

```typescript
import { isValidIcon } from 'blip-tokens/icons';

function validateIconInput(userInput: string) {
  if (!isValidIcon(userInput)) {
    throw new Error(`"${userInput}" is not a valid icon name`);
  }
  return userInput;
}
```

### Search/Filter Icons

```typescript
import { AllIcons } from 'blip-tokens/icons';

function searchIcons(query: string) {
  return AllIcons.filter(name => 
    name.toLowerCase().includes(query.toLowerCase())
  );
}

// Search for all arrow icons
const arrowIcons = searchIcons('arrow');
// ["arrow-ball-down", "arrow-ball-left", "arrow-down", ...]
```

## Key Benefits

1. **Type Safety**: TypeScript will catch invalid icon names at compile time
2. **Autocomplete**: IDE will suggest available icon names
3. **Always in Sync**: Icon names come directly from the filesystem, not JSON
4. **No Duplicates**: Unique icon names guaranteed by the filesystem
5. **Runtime Validation**: Helper functions for dynamic icon names
6. **Optimized Bundle Size**: `AllIcons` is pre-computed during the build process to avoid duplicating icon names (~45% smaller)

## Icon Counts

- **Outline Icons**: 303
- **Solid Icons**: 366
- **Unique Icons**: 587

## Notes

- Icon names are extracted from filenames (without `.svg` extension)
- For icons in subdirectories (like `solid/flags/`), only the filename is used
- Icon names are sorted alphabetically
- Icon names are always normalized to lowercase, with spaces converted to hyphens. Any other characters present in the filename (such as numbers or other symbols) may also appear in the exported icon names.
