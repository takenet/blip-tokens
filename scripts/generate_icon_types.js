// Script to generate TypeScript icon type definitions from filesystem
import { existsSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
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

const COLORS = {
  RESET: '\x1b[0m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  BG_GREEN: '\x1b[42m',
  BG_RED: '\x1b[41m',
};

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

    const items = readdirSync(currentPath, { withFileTypes: true });

    items.forEach(item => {
      const fullPath = join(currentPath, item.name);

      if (item.isDirectory()) {
        // Recursively traverse subdirectories
        traverse(fullPath);
      } else if (item.isFile() && item.name.endsWith('.svg')) {
        // Convert filename to icon name: remove .svg, replace spaces with hyphens, lowercase
        const iconName = item.name.replace(/\.svg$/, '').replace(/\s/g, '-').toLowerCase();
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
  return items.map(item => JSON.stringify(item)).join(' | ');
}

/**
 * Generate JavaScript file with icon arrays. AllIcons is pre-computed from OutlineIcons and SolidIcons during the build process and serialized into the generated file.
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
 * Pre-computed at build time from OutlineIcons and SolidIcons to reduce runtime overhead while avoiding duplication.
 * @type {ReadonlyArray<string>}
 */
export const AllIcons = ${JSON.stringify(allIcons, null, 2)};

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
export declare const OutlineIcons: readonly OutlineIcon[];

/**
 * Array of all solid icon names (from assets/icons/solid)
 */
export declare const SolidIcons: readonly SolidIcon[];

/**
 * Array of all unique icon names (union of outline and solid)
 */
export declare const AllIcons: readonly IconName[];

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

  console.log(`${COLORS.BLUE}[Icon Types Generator]${COLORS.RESET} Scanning filesystem...`);

  // Get icon names from filesystem
  const outlineIcons = getIconNames(iconsOutlinePath);
  const solidIcons = getIconNames(iconsSolidPath);
  const allIcons = getUniqueIconNames(outlineIcons, solidIcons);

  if (allIcons.length === 0) {
    console.error(`${COLORS.BG_RED}[Error]${COLORS.RESET} No icons found. Please ensure that the directories "${iconsOutlinePath}" and "${iconsSolidPath}" exist and contain icon files.`);
    process.exit(1);
  }
  console.log(`${COLORS.CYAN}[✓]${COLORS.RESET} Found ${outlineIcons.length} outline icons`);
  console.log(`${COLORS.CYAN}[✓]${COLORS.RESET} Found ${solidIcons.length} solid icons`);
  console.log(`${COLORS.CYAN}[✓]${COLORS.RESET} Total unique icons: ${allIcons.length}`);

  // Generate output files
  generateJavaScriptFile(outlineIcons, solidIcons, allIcons);
  console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} Generated ${outputJsPath}`);

  generateTypeScriptFile(outlineIcons, solidIcons, allIcons);
  console.log(`${COLORS.GREEN}[✓]${COLORS.RESET} Generated ${outputDtsPath}`);

  console.log(`${COLORS.BG_GREEN}[Success]${COLORS.RESET} Icon types generated successfully!`);
} catch (error) {
  console.error(`${COLORS.BG_RED}[Error]${COLORS.RESET} Failed to generate icon types:`, error);
  process.exit(1);
}
