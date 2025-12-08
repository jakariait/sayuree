#!/bin/bash

# Load environment variables from .env file
if [ -f "$(dirname "$0")/.env" ]; then
    source "$(dirname "$0")/.env"
else
    echo "Error: .env file not found in $(dirname "$0")"
    exit 1
fi

# === CONFIG ===
MONGO_URI="$MONGO_URI"
PROJECT_DIR="/Users/jakaria/Desktop/sayuree/backend"
BACKUP_DIR="$PROJECT_DIR/DatabaseBackup"
DATE=$(date +%F_%H-%M-%S)
ARCHIVE_NAME="mongo_backup_$DATE.tar.gz"

# === BACKUP ===
mkdir -p "$BACKUP_DIR"   # ✅ creates the folder if it doesn’t exist
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE"

# === COMPRESS ===
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# === CLEANUP (keep only last 7 backups) ===
ls -t $BACKUP_DIR/mongo_backup_* 2>/dev/null | sed -e '1,7d' | xargs rm -f