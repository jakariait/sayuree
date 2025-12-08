#!/bin/bash

# Load environment variables from .env file in the same folder as this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
else
    echo "Error: .env file not found in $SCRIPT_DIR"
    exit 1
fi

# === CONFIG ===
PROJECT_DIR="$SCRIPT_DIR"                 # Automatically set project dir to script location
BACKUP_DIR="$PROJECT_DIR/DatabaseBackup"  # Backup folder inside project
DATE=$(date +%F_%H-%M-%S)
ARCHIVE_NAME="mongo_backup_$DATE.tar.gz"

# === BACKUP ===
mkdir -p "$BACKUP_DIR"   # creates the folder if it doesn’t exist
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"

# === COMPRESS ===
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# === CLEANUP (keep only last 7 backups) ===
ls -t $BACKUP_DIR/mongo_backup_* 2>/dev/null | sed -e '1,7d' | xargs rm -f
