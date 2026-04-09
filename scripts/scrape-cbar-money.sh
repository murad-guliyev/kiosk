#!/bin/bash
# One-time scrape of cbar.az money data
# Outputs JSON files and downloads images

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_DIR/src/data"
ASSETS_DIR="$PROJECT_DIR/src/assets/money"
TEMP_DIR="$PROJECT_DIR/scripts/temp"

mkdir -p "$DATA_DIR" "$ASSETS_DIR" "$TEMP_DIR"

echo "Scraping list pages for item-to-detail mapping..."

# Extract items with their titles, image URLs, and detail IDs from each list page
for cat in 1 2 3; do
  for type in banknotes coins; do
    echo "  Fetching $type category=$cat ..."
    curl -s "https://cbar.az/moneymarks/$type?category=$cat" > "$TEMP_DIR/list_${type}_${cat}.html"
  done
done

echo "List pages saved. Detail pages will be fetched by the Node script."
