#!/bin/bash
# ERA-ENGINE — Daily Update Script
# Dijalankan otomatis oleh launchd setiap pagi jam 07:00
# Bisa juga dijalankan manual: bash scripts/run_update.sh

set -e

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$REPO_DIR/scripts/update.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

log() {
  echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

log "=============================="
log "ERA-ENGINE Update dimulai"
log "=============================="

# Pastikan di repo yang benar
cd "$REPO_DIR"

PYTHON=/opt/homebrew/bin/python3

# Install dependencies jika belum ada
if ! $PYTHON -c "import openpyxl" 2>/dev/null; then
  log "Installing openpyxl..."
  $PYTHON -m pip install openpyxl --quiet
fi

# Jalankan parser
log "Menjalankan parser Excel..."
if $PYTHON "$REPO_DIR/scripts/parse_excel.py"; then
  log "Parser selesai ✅"
else
  log "ERROR: Parser gagal ❌"
  exit 1
fi

# Cek apakah ada perubahan
if git diff --quiet data/live_data.json; then
  log "Tidak ada perubahan data — skip commit"
  exit 0
fi

# Commit dan push
log "Commit dan push ke GitHub..."
git add data/live_data.json
git commit -m "data: update harian $(date '+%d %b %Y %H:%M')"
git push origin main

log "Push berhasil ✅ — GitHub Actions akan deploy ke Netlify"
log "Dashboard live dalam ~1 menit di: https://era-engine.netlify.app"
