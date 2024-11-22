#!/bin/bash

function show_help {
    echo "MongoDB Database Management Script"
    echo "Usage:"
    echo "  ./scripts/db.sh [command]"
    echo ""
    echo "Commands:"
    echo "  backup     Create a backup of the database"
    echo "  restore    Restore database from backup"
    echo "  clean      Remove all data from the database"
    echo "  seed      Seed the database with initial data"
    echo "  status    Check MongoDB connection status"
}

case "$1" in
    "backup")
        echo "📦 Creating database backup..."
        cd backend && npm run db:backup
        ;;
    
    "restore")
        echo "📥 Restoring database..."
        cd backend && npm run db:restore
        ;;
    
    "clean")
        echo "🧹 Cleaning database..."
        cd backend && npm run db:clean
        ;;
    
    "seed")
        echo "🌱 Seeding database..."
        cd backend && npm run db:seed
        ;;
    
    "status")
        echo "🔍 Checking database status..."
        cd backend && npm run db:status
        ;;
    
    *)
        show_help
        ;;
esac 