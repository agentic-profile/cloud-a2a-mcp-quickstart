#!/bin/bash

# Convert all TypeScript files from 2-space to 4-space indentation
echo "Converting indentation from 2 spaces to 4 spaces..."

# Find all TypeScript files
find src -name "*.ts" -o -name "*.tsx" | while read file; do
    echo "Processing: $file"
    
    # Create a temporary file
    temp_file="${file}.tmp"
    
    # Convert indentation levels
    # Level 1: 2 spaces -> 4 spaces
    # Level 2: 4 spaces -> 8 spaces  
    # Level 3: 6 spaces -> 12 spaces
    # Level 4: 8 spaces -> 16 spaces
    # Level 5: 10 spaces -> 20 spaces
    # Level 6: 12 spaces -> 24 spaces
    # Level 7: 14 spaces -> 28 spaces
    # Level 8: 16 spaces -> 32 spaces
    
    cp "$file" "$temp_file"
    
    # Convert each level
    sed -i '' 's/^  /    /g' "$temp_file"      # Level 1
    sed -i '' 's/^    /        /g' "$temp_file" # Level 2
    sed -i '' 's/^      /            /g' "$temp_file" # Level 3
    sed -i '' 's/^        /                /g' "$temp_file" # Level 4
    sed -i '' 's/^          /                    /g' "$temp_file" # Level 5
    sed -i '' 's/^            /                        /g' "$temp_file" # Level 6
    sed -i '' 's/^              /                            /g' "$temp_file" # Level 7
    sed -i '' 's/^                /                                /g' "$temp_file" # Level 8
    
    # Replace original with converted file
    mv "$temp_file" "$file"
done

echo "Indentation conversion complete!"
