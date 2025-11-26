// Script to generate TypeScript icon type definitions from filesystem
import { existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const iconsOutlinePath = resolve(__dirname, '../assets/icons/outline');
const iconsSolidPath = resolve(__dirname, '../assets/icons/solid');
const buildPath = resolve(__dirname, '../build');
const outputJsPath = join(buildPath, 'icons.js');
const outputDtsPath = join(buildPath, 'icons.d.ts');

/**
 * Recursively get all SVG files from a directory
 * @param {string} dirPath - Directory to scan
 * @returns {string[]} - Array of icon names (without .svg extension)
 */
function getIconNames(dirPath) {
  const iconNames = [];

  function traverse(currentPath) {
    if (!existsSync(currentPath)) {
      return;
    }

    const items = readdirSync(currentPath);

    items.forEach(item => {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively traverse subdirectories
        traverse(fullPath);
      } else if (item.endsWith('.svg')) {
        // Extract filename without extension
        const iconName = item.replace('.svg', '');
        iconNames.push(iconName);
      }
    });
  }

  traverse(dirPath);
  return iconNames.sort();
}

/**
 * Get unique icon names from both outline and solid
 * @param {string[]} outlineIcons
 * @param {string[]} solidIcons
 * @returns {string[]} - Sorted unique icon names
 */
function getUniqueIconNames(outlineIcons, solidIcons) {
  const uniqueSet = new Set([...outlineIcons, ...solidIcons]);
  return Array.from(uniqueSet).sort();
}

/**
 * Generate TypeScript union type from array of strings
 * @param {string[]} items
 * @returns {string}
 */
function generateUnionType(items) {
  if (items.length === 0) return 'never';
  return items.map(item => `"${item}"`).join(' | ');
}

/**
 * Generate JavaScript file with icon arrays
 * @param {string[]} outlineIcons
 * @param {string[]} solidIcons
 * @param {string[]} allIcons
 */
function generateJavaScriptFile(outlineIcons, solidIcons, allIcons) {
  const content = `// Auto-generated file. Do not edit manually.
// Generated from assets/icons directory structure

/**
 * Array of all outline icon names (from assets/icons/outline)
 * @type {ReadonlyArray<string>}
 */
export const OutlineIcons = ${JSON.stringify(outlineIcons, null, 2)};

/**
 * Array of all solid icon names (from assets/icons/solid)
 * @type {ReadonlyArray<string>}
 */
export const SolidIcons = ${JSON.stringify(solidIcons, null, 2)};

/**
 * Array of all unique icon names (union of outline and solid)
 * Computed dynamically to avoid duplication and reduce package size
 * @type {ReadonlyArray<string>}
 */
export const AllIcons = Array.from(new Set([...OutlineIcons, ...SolidIcons])).sort();

const outlineIconsSet = new Set(OutlineIcons);
/**
 * Check if an icon name exists in the outline set
 * @param {string} iconName - Icon name to check
 * @returns {boolean}
 */
export function isOutlineIcon(iconName) {
  return outlineIconsSet.has(iconName);
}

const solidIconsSet = new Set(SolidIcons);

/**
 * Check if an icon name exists in the solid set
 * @param {string} iconName - Icon name to check
 * @returns {boolean}
 */
export function isSolidIcon(iconName) {
  return solidIconsSet.has(iconName);
}

const allIconsSet = new Set(AllIcons);

/**
 * Check if an icon name exists in any set
 * @param {string} iconName - Icon name to check
 * @returns {boolean}
 */
export function isValidIcon(iconName) {
  return allIconsSet.has(iconName);
}
`;

  writeFileSync(outputJsPath, content, 'utf8');
}

/**
 * Generate TypeScript definition file
 * @param {string[]} outlineIcons
 * @param {string[]} solidIcons
 * @param {string[]} allIcons
 */
function generateTypeScriptFile(outlineIcons, solidIcons, allIcons) {
  const outlineType = generateUnionType(outlineIcons);
  const solidType = generateUnionType(solidIcons);
  const allIconsType = generateUnionType(allIcons);

  const content = `// Auto-generated file. Do not edit manually.
// Generated from assets/icons directory structure

/**
 * Array of all outline icon names (from assets/icons/outline)
 */
export declare const OutlineIcons: readonly string[];

/**
 * Array of all solid icon names (from assets/icons/solid)
 */
export declare const SolidIcons: readonly string[];

/**
 * Array of all unique icon names (union of outline and solid)
 */
export declare const AllIcons: readonly string[];

/**
 * Type representing all outline icon names
 */
export type OutlineIcon = ${outlineType};

/**
 * Type representing all solid icon names
 */
export type SolidIcon = ${solidType};

/**
 * Type representing all unique icon names
 */
export type IconName = ${allIconsType};

/**
 * Check if an icon name exists in the outline set
 * @param iconName - Icon name to check
 * @returns true if the icon exists in outline set
 */
export declare function isOutlineIcon(iconName: string): iconName is OutlineIcon;

/**
 * Check if an icon name exists in the solid set
 * @param iconName - Icon name to check
 * @returns true if the icon exists in solid set
 */
export declare function isSolidIcon(iconName: string): iconName is SolidIcon;

/**
 * Check if an icon name exists in any set
 * @param iconName - Icon name to check
 * @returns true if the icon exists
 */
export declare function isValidIcon(iconName: string): iconName is IconName;
`;

  writeFileSync(outputDtsPath, content, 'utf8');
}

// Main execution
try {
  // Ensure build directory exists
  if (!existsSync(buildPath)) {
    mkdirSync(buildPath, { recursive: true });
  }

  console.log('\x1b[34m[Icon Types Generator]\x1b[0m Scanning filesystem...');

  // Get icon names from filesystem
  const outlineIcons = getIconNames(iconsOutlinePath);
  const solidIcons = getIconNames(iconsSolidPath);
  const allIcons = getUniqueIconNames(outlineIcons, solidIcons);

  console.log(`\x1b[36m[✓]\x1b[0m Found ${outlineIcons.length} outline icons`);
  console.log(`\x1b[36m[✓]\x1b[0m Found ${solidIcons.length} solid icons`);
  console.log(`\x1b[36m[✓]\x1b[0m Total unique icons: ${allIcons.length}`);

  // Generate output files
  generateJavaScriptFile(outlineIcons, solidIcons, allIcons);
  console.log(`\x1b[32m[✓]\x1b[0m Generated ${outputJsPath}`);

  generateTypeScriptFile(outlineIcons, solidIcons, allIcons);
  console.log(`\x1b[32m[✓]\x1b[0m Generated ${outputDtsPath}`);

  console.log('\x1b[42m[Success]\x1b[0m Icon types generated successfully!');
} catch (error) {
  console.error('\x1b[41m[Error]\x1b[0m Failed to generate icon types:', error);
  process.exit(1);
}
