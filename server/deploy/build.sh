#!/usr/bin/env bash
# Build a fully static, stripped Linux/amd64 binary with zero runtime
# dependencies (CGO disabled -> no libc linkage; modernc SQLite is pure Go).
set -euo pipefail
cd "$(dirname "$0")/.."

CGO_ENABLED=0 GOOS="${GOOS:-linux}" GOARCH="${GOARCH:-amd64}" \
	go build -trimpath -ldflags="-s -w" -o bx-server .

echo "built $(du -h bx-server | cut -f1) -> $(pwd)/bx-server"
file bx-server
