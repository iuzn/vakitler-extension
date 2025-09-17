#!/bin/bash

# Usage: bash build.sh
# This script builds the extension and creates a zip file

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

DATE=$(date +%Y-%m-%d_%H%M) # Date format: YYYY-MM-DD_HHMM

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Determine whether to use Bun or npm
if command_exists bun; then
    PACKAGE_MANAGER="bun"
    echo -e "${GREEN}Bun detected. Using Bun for installation and building.${NC}"
else
    PACKAGE_MANAGER="npm"
    echo -e "${GREEN}Bun not detected. Using npm for installation and building.${NC}"
fi

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}node_modules not found. Running $PACKAGE_MANAGER install...${NC}"
    $PACKAGE_MANAGER install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: $PACKAGE_MANAGER install failed${NC}"
        exit 1
    fi
fi

if ! command -v jq &> /dev/null
then
    echo -e "${RED}jq could not be found. Please install it using the following command:${NC}"
    echo -e "${GREEN}brew install jq${NC}"
    exit 1
fi

VERSION=$(jq -r .version package.json)

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Unable to extract version from package.json${NC}"
  exit 1
fi

echo -e "${GREEN}Version extracted from package.json: $VERSION${NC}"

build_and_zip() {
  local zip_name=$1
  rm -f "$zip_name"

  if [ "$PACKAGE_MANAGER" = "bun" ]; then
    bun run build
  else
    npm run build
  fi

  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
  fi

  zip -r "$zip_name" build/
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Zipping failed${NC}"
    exit 1
  fi

  if [ ! -f "$zip_name" ]; then
    echo -e "${RED}Error: Zip file not created${NC}"
    exit 1
  fi

  echo -e "${GREEN}Build and zipping successful${NC}"

  # Clean up build directory
  rm -rf build/
  echo -e "${GREEN}Build directory cleaned up${NC}"
}

if [ -d "build" ]; then
  rm -rf build/
fi

build_and_zip "build-$VERSION-$DATE.zip"