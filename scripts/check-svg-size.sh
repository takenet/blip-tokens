#!/bin/bash

# Script: check-svg-size.sh
# Descrição: Verifica tamanho dos arquivos SVG e alerta sobre arquivos grandes
# Uso: bash scripts/check-svg-size.sh

set -e

# Configuração
MAX_SIZE_KB=100  # Erro se SVG > 100KB
WARN_SIZE_KB=50  # Warning se SVG > 50KB
ASSETS_DIR="assets"

# Cores
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          SVG FILE SIZE VERIFICATION                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Verificar se diretório existe
if [ ! -d "$ASSETS_DIR" ]; then
    echo -e "${RED}❌ Error: Directory $ASSETS_DIR not found${NC}"
    exit 1
fi

# Contar total de SVGs
TOTAL_SVGS=$(find "$ASSETS_DIR" -name "*.svg" | wc -l)
echo -e "${BLUE}📊 Total SVG files: $TOTAL_SVGS${NC}"
echo ""

# Buscar arquivos grandes (> 100KB)
echo "🔍 Checking for files larger than ${MAX_SIZE_KB}KB..."
LARGE_FILES=$(find "$ASSETS_DIR" -name "*.svg" -size +${MAX_SIZE_KB}k 2>/dev/null)

if [ -n "$LARGE_FILES" ]; then
    echo -e "${RED}❌ ERROR: Found SVGs larger than ${MAX_SIZE_KB}KB:${NC}"
    echo ""
    echo "$LARGE_FILES" | while read file; do
        SIZE=$(du -h "$file" | awk '{print $1}')
        echo -e "  ${RED}▸${NC} $file ${RED}($SIZE)${NC}"
    done
    echo ""
    echo -e "${YELLOW}💡 These files should be optimized or reviewed${NC}"
    echo -e "${YELLOW}   Run: npm run optimize:svg${NC}"
    echo ""
    EXIT_CODE=1
else
    echo -e "${GREEN}✅ No files larger than ${MAX_SIZE_KB}KB${NC}"
    EXIT_CODE=0
fi

echo ""

# Buscar arquivos de tamanho médio (50KB - 100KB)
echo "⚠️  Checking for files between ${WARN_SIZE_KB}KB and ${MAX_SIZE_KB}KB..."
WARN_FILES=$(find "$ASSETS_DIR" -name "*.svg" -size +${WARN_SIZE_KB}k -size -${MAX_SIZE_KB}k 2>/dev/null)

if [ -n "$WARN_FILES" ]; then
    WARN_COUNT=$(echo "$WARN_FILES" | wc -l)
    echo -e "${YELLOW}⚠️  Found $WARN_COUNT SVGs that could be optimized:${NC}"
    echo ""
    echo "$WARN_FILES" | while read file; do
        SIZE=$(du -h "$file" | awk '{print $1}')
        echo -e "  ${YELLOW}▸${NC} $file ${YELLOW}($SIZE)${NC}"
    done
    echo ""
    echo -e "${YELLOW}💡 Consider optimizing these files${NC}"
else
    echo -e "${GREEN}✅ No files in warning range${NC}"
fi

echo ""

# Estatísticas gerais
echo "📈 Statistics:"
TOTAL_SIZE=$(find "$ASSETS_DIR" -name "*.svg" -exec du -b {} + | awk '{sum+=$1} END {print sum}')
TOTAL_SIZE_MB=$(echo "scale=2; $TOTAL_SIZE / 1024 / 1024" | bc)
AVG_SIZE_KB=$(echo "scale=2; $TOTAL_SIZE / $TOTAL_SVGS / 1024" | bc)

echo "  • Total size: ${TOTAL_SIZE_MB} MB"
echo "  • Average file size: ${AVG_SIZE_KB} KB"

# Top 5 maiores arquivos
echo ""
echo "📊 Top 5 largest files:"
find "$ASSETS_DIR" -name "*.svg" -exec du -h {} + | sort -rh | head -5 | while read size file; do
    echo "  • $file - ${size}"
done

echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✅ ALL SVG FILES ARE WITHIN SIZE LIMITS ✅           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ❌ SOME SVG FILES NEED OPTIMIZATION ❌               ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
fi

echo ""

exit $EXIT_CODE
