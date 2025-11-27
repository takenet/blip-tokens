#!/bin/bash

# SVG Asset Analysis Script
# This script analyzes SVG files for size and optimization opportunities

echo "==================================================="
echo "SVG ASSET ANALYSIS REPORT"
echo "==================================================="
echo ""

# Count total SVG files
TOTAL_FILES=$(find assets -type f -name "*.svg" | wc -l)
echo "📊 Total SVG files: $TOTAL_FILES"
echo ""

# Calculate total size
TOTAL_SIZE_BYTES=$(find assets -type f -name "*.svg" -exec du -b {} + | awk '{sum+=$1} END {print sum}')
TOTAL_SIZE_MB=$(echo "scale=2; $TOTAL_SIZE_BYTES / 1024 / 1024" | bc)
echo "💾 Total size: $TOTAL_SIZE_BYTES bytes ($TOTAL_SIZE_MB MB)"
echo ""

# Top 10 largest files
echo "🔝 Top 10 Largest SVG Files:"
echo "---------------------------------------------------"
find assets -type f -name "*.svg" -exec du -b {} + | sort -rn | head -10 | while read size file; do
    size_kb=$(echo "scale=2; $size / 1024" | bc)
    echo "  $size_kb KB - $(basename $file)"
done
echo ""

# Breakdown by directory
echo "📁 Size Breakdown by Directory:"
echo "---------------------------------------------------"
for dir in assets/*/; do
    if [ -d "$dir" ]; then
        dir_size=$(find "$dir" -type f -name "*.svg" -exec du -b {} + 2>/dev/null | awk '{sum+=$1} END {print sum}')
        if [ ! -z "$dir_size" ]; then
            dir_size_kb=$(echo "scale=2; $dir_size / 1024" | bc)
            dir_count=$(find "$dir" -type f -name "*.svg" | wc -l)
            dir_name=$(basename "$dir")
            echo "  $dir_name: $dir_size_kb KB ($dir_count files)"
        fi
    fi
done
echo ""

# Average file size
AVG_SIZE=$(echo "scale=2; $TOTAL_SIZE_BYTES / $TOTAL_FILES" | bc)
AVG_SIZE_KB=$(echo "scale=2; $AVG_SIZE / 1024" | bc)
echo "📈 Average file size: $AVG_SIZE_KB KB"
echo ""

# Check for common optimization opportunities
echo "🔍 Optimization Opportunities:"
echo "---------------------------------------------------"

# Files with comments
COMMENTS_COUNT=$(grep -l '<!--' assets/**/*.svg 2>/dev/null | wc -l)
echo "  Files with XML comments: $COMMENTS_COUNT"

# Files with metadata
METADATA_COUNT=$(grep -l '<metadata' assets/**/*.svg 2>/dev/null | wc -l)
echo "  Files with metadata tags: $METADATA_COUNT"

# Files with IDs
ID_COUNT=$(grep -l 'id=' assets/**/*.svg 2>/dev/null | wc -l)
echo "  Files with ID attributes: $ID_COUNT"

# Files with excessive precision
PRECISION_COUNT=$(grep -l '\.[0-9]\{4,\}' assets/**/*.svg 2>/dev/null | wc -l)
echo "  Files with high-precision numbers: $PRECISION_COUNT"

# Files with default attributes
DEFAULT_ATTRS=$(grep -l 'fill="black"' assets/**/*.svg 2>/dev/null | wc -l)
echo "  Files with default 'fill=black': $DEFAULT_ATTRS"

echo ""
echo "==================================================="
echo "END OF REPORT"
echo "==================================================="
