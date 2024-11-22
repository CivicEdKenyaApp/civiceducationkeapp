#!/bin/bash

DB_NAME="civic_education"
BACKUP_DIR="./backups"

function show_help {
    echo "MongoDB Database Management Script for Civic Education Kenya"
    echo "Usage:"
    echo "  ./scripts/db.sh [command]"
    echo ""
    echo "Commands:"
    echo "  backup     Create a backup of the database"
    echo "  restore    Restore database from backup"
    echo "  clean      Remove all data from the database"
    echo "  seed      Seed the database with initial data"
    echo "  status    Check MongoDB connection status"
    echo "  migrate   Run database migrations"
}

function ensure_backup_dir {
    mkdir -p "$BACKUP_DIR"
}

case "$1" in
    "backup")
        echo "📦 Creating database backup..."
        ensure_backup_dir
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.gz"
        docker exec mongodb mongodump --db=$DB_NAME --archive --gzip > "$BACKUP_FILE"
        echo "✅ Backup created at $BACKUP_FILE"
        ;;
    
    "restore")
        echo "📥 Restoring database from backup..."
        if [ -z "$2" ]; then
            # Get the latest backup file
            BACKUP_FILE=$(ls -t $BACKUP_DIR/backup_*.gz | head -1)
        else
            BACKUP_FILE="$2"
        fi
        
        if [ ! -f "$BACKUP_FILE" ]; then
            echo "❌ Backup file not found: $BACKUP_FILE"
            exit 1
        fi
        
        docker exec -i mongodb mongorestore --db=$DB_NAME --archive --gzip < "$BACKUP_FILE"
        echo "✅ Database restored from $BACKUP_FILE"
        ;;
    
    "clean")
        echo "⚠️  WARNING: This will delete all data in the database!"
        read -p "Are you sure you want to continue? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🧹 Cleaning database..."
            docker exec mongodb mongosh $DB_NAME --eval "db.dropDatabase()"
            echo "✅ Database cleaned"
        fi
        ;;
    
    "seed")
        echo "🌱 Seeding database..."
        npx ts-node src/scripts/seed.ts
        echo "✅ Database seeded"
        ;;
    
    "status")
        echo "🔍 Checking MongoDB status..."
        docker exec mongodb mongosh --eval "
            try {
                db.runCommand('ping');
                print('MongoDB is running');
                db = db.getSiblingDB('$DB_NAME');
                print('Collections:');
                db.getCollectionNames().forEach(printjson);
            } catch(e) {
                print('Error: ' + e);
            }
        "
        ;;
    
    "migrate")
        echo "🔄 Running database migrations..."
        npx ts-node src/scripts/migrate.ts
        echo "✅ Migrations complete"
        ;;
    
    *)
        show_help
        ;;
esac 