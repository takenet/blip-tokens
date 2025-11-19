# Quick Start: SVG Optimization with SVGO

## Installation

```bash
npm install --save-dev svgo
```

## Usage

### Optimize a single file
```bash
npx svgo input.svg -o output.svg
```

### Optimize all SVGs in a directory
```bash
npx svgo assets/**/*.svg --config=svgo.config.js
```

### Preview optimization (dry-run)
```bash
npx svgo assets/**/*.svg --config=svgo.config.js --dry-run
```

### Check size reduction
```bash
# Before optimization
du -h assets/ | tail -1

# Optimize
npm run optimize:svg

# After optimization
du -h assets/ | tail -1
```

## Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "optimize:svg": "svgo assets/**/*.svg --config=svgo.config.js",
    "optimize:svg:check": "svgo assets/**/*.svg --config=svgo.config.js --dry-run",
    "optimize:svg:stats": "svgo assets/**/*.svg --config=svgo.config.js --dry-run --show-plugins",
    "analyze:svg": "bash svg-analysis.sh"
  }
}
```

## Before Committing Changes

1. **Run the analysis script**
   ```bash
   npm run analyze:svg
   ```

2. **Test optimization on a sample**
   ```bash
   cp assets/emojis/BeamingFacewithSmilingEyes.svg test-emoji.svg
   npx svgo test-emoji.svg
   # Compare sizes and visual output
   ```

3. **Optimize all assets**
   ```bash
   npm run optimize:svg
   ```

4. **Verify no visual regressions**
   - Open sample files in browser before/after
   - Check critical assets in your application
   - Run visual regression tests if available

5. **Commit changes**
   ```bash
   git add assets/
   git commit -m "chore: optimize SVG assets with SVGO (-22% size reduction)"
   ```

## Expected Results

- **Size Reduction**: 20-25% (approximately 1.45 MB)
- **Files Affected**: All 1,216 SVG files
- **Visual Quality**: No degradation (lossless optimization)
- **Time Required**: ~30 seconds for full optimization

## Troubleshooting

### Issue: SVG looks different after optimization

**Solution**: Adjust `floatPrecision` in `svgo.config.js`:
```javascript
cleanupNumericValues: {
  floatPrecision: 3 // Increase if needed
}
```

### Issue: SVG IDs are removed and breaking references

**Solution**: Preserve specific IDs:
```javascript
cleanupIds: {
  preserve: ['myImportantId', 'anotherCriticalId']
}
```

### Issue: Optimization is too aggressive

**Solution**: Disable specific plugins:
```javascript
plugins: [
  {
    name: 'mergePaths',
    active: false // Disable path merging
  }
]
```

## Integration with Build Tools

### Webpack
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          'svg-url-loader',
          {
            loader: 'svgo-loader',
            options: {
              configFile: './svgo.config.js'
            }
          }
        ]
      }
    ]
  }
};
```

### Vite
```javascript
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo'],
        svgoConfig: require('./svgo.config.js')
      }
    })
  ]
})
```

## Monitoring

Track optimization impact:

```bash
# Check total size
du -sh assets/

# Count files
find assets -name "*.svg" | wc -l

# Average file size
find assets -name "*.svg" -exec du -b {} + | awk '{sum+=$1; count++} END {print "Average:", sum/count, "bytes"}'
```

## Resources

- [SVGO Documentation](https://github.com/svg/svgo)
- [Full Analysis Report](./SVG-OPTIMIZATION-REPORT.md)
- [Configuration Reference](./svgo.config.js)
