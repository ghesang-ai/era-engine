#!/bin/bash
# ERA-ENGINE — Setup Mac Scheduler (launchd)
# Jalankan SEKALI: bash scripts/setup_scheduler.sh
# Setelah itu script akan jalan otomatis setiap hari jam 07:00

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLIST_NAME="com.eraengine.dailyupdate"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"
SCRIPT_PATH="$REPO_DIR/scripts/run_update.sh"
LOG_PATH="$REPO_DIR/scripts/update.log"

echo "ERA-ENGINE — Setup Scheduler"
echo "Repo: $REPO_DIR"
echo "Script: $SCRIPT_PATH"
echo ""

# Buat plist file
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT_PATH</string>
    </array>

    <!-- Jam 07:00 setiap hari -->
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>7</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>$LOG_PATH</string>

    <key>StandardErrorPath</key>
    <string>$LOG_PATH</string>

    <!-- Jalankan jika Mac tertidur saat jadwal (ketika bangun, langsung jalan) -->
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
EOF

# Set permission
chmod 600 "$PLIST_PATH"
chmod +x "$SCRIPT_PATH"

# Load ke launchd
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"

echo "✅ Scheduler aktif!"
echo ""
echo "Jadwal: setiap hari jam 07:00 WIB"
echo "Log: $LOG_PATH"
echo ""
echo "Perintah berguna:"
echo "  Lihat log       : tail -f $LOG_PATH"
echo "  Test run manual : bash $SCRIPT_PATH"
echo "  Cek status      : launchctl list | grep eraengine"
echo "  Nonaktifkan     : launchctl unload $PLIST_PATH"
