#!/usr/bin/env bash
set -euo pipefail

echo "Granting codesign permanent access to your signing keys..."
read -sp "Login keychain password: " KP; echo
security set-key-partition-list -S apple-tool:,apple: -s -k "$KP" ~/Library/Keychains/login.keychain-db
echo "Done. Builds will no longer prompt for your password."
