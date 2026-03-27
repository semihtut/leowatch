#!/bin/bash
# ThreatIntel Auto-Push Script
# Unpushed commit varsa otomatik push yapar

REPO_DIR="$HOME/Desktop/ThreatIntel/threat-brief"
LOG_FILE="$HOME/Desktop/ThreatIntel/threat-brief/scripts/auto-push.log"

cd "$REPO_DIR" || exit 1

# Unpushed commit var mı kontrol et
UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null)

if [ -n "$UNPUSHED" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Unpushed commits found:" >> "$LOG_FILE"
    echo "$UNPUSHED" >> "$LOG_FILE"

    if git push origin main 2>>"$LOG_FILE"; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Push successful." >> "$LOG_FILE"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Push FAILED." >> "$LOG_FILE"
    fi
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] No unpushed commits." >> "$LOG_FILE"
fi
