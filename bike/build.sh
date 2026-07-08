#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/src-tauri"
(cd ../../bicycle && go build -ldflags="-s -w" -o "$(pwd -P)/../bike/src-tauri/bin/bicycle-aarch64-apple-darwin" .)
cargo tauri build --bundles app,dmg
