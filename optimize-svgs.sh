#!/bin/bash

# SVG Optimization Script
# Optimizes all SVG files in the assets directory using SVGO

set -e

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                           ║"
echo "║                    SVG ASSET OPTIMIZATION SCRIPT                          ║"
echo "║                                                                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Ensure we're using the correct Node version
source ~/.nvm/nvm.sh
nvm use 18

# Get initial statistics
echo "📊 Calculating initial size..."
INITIAL_SIZE=$(find assets -type f -name "*.svg" -exec du -b {} + | awk '{sum+=$1} END {print sum}')
INITIAL_SIZE_MB=$(echo "scale=2; $INITIAL_SIZE / 1024 / 1024" | bc)
TOTAL_FILES=$(find assets -type f -name "*.svg" | wc -l)

echo "   Total files: $TOTAL_FILES"
echo "   Initial size: $INITIAL_SIZE bytes ($INITIAL_SIZE_MB MB)"
echo ""

# Optimize all SVG files
echo "⚙️  Optimizing SVG files..."
echo "   This may take a few minutes..."
echo ""

npx svgo assets/**/*.svg --config=svgo.config.js --multipass --quiet

# Get final statistics
echo ""
echo "✅ Optimization complete!"
echo ""
echo "📊 Calculating final size..."
FINAL_SIZE=$(find assets -type f -name "*.svg" -exec du -b {} + | awk '{sum+=$1} END {print sum}')
FINAL_SIZE_MB=$(echo "scale=2; $FINAL_SIZE / 1024 / 1024" | bc)
SAVED_SIZE=$(echo "$INITIAL_SIZE - $FINAL_SIZE" | bc)
SAVED_SIZE_MB=$(echo "scale=2; $SAVED_SIZE / 1024 / 1024" | bc)
REDUCTION_PERCENT=$(echo "scale=2; ($INITIAL_SIZE - $FINAL_SIZE) / $INITIAL_SIZE * 100" | bc)

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                          OPTIMIZATION RESULTS                             ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  Initial size:    $INITIAL_SIZE_MB MB"
echo "  Final size:      $FINAL_SIZE_MB MB"
echo "  Size reduction:  $SAVED_SIZE_MB MB ($REDUCTION_PERCENT%)"
echo "  Files processed: $TOTAL_FILES"
echo ""
echo "✅ All SVG assets have been optimized!"
echo ""
echo "📝 Next steps:"
echo "   1. Review the changes: git diff"
echo "   2. Test the assets visually"
echo "   3. Commit the changes: git add . && git commit -m 'chore: optimize SVG assets with SVGO'"
echo ""
