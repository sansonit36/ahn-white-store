#!/bin/bash

# Deployment Script for AHN White+
# Usage: ./deploy.sh [user@ip]

TARGET=$1

if [ -z "$TARGET" ]; then
  echo "Usage: ./deploy.sh <user@ip>"
  exit 1
fi

echo "🚀 Deploying to $TARGET..."

# Commands to run on server
REMOTE_CMDS="
set -e
# Try common paths
cd /var/www/ahn-store || { echo '❌ Could not find project directory'; exit 1; }

echo '📥 Pulling latest changes...'
git reset --hard # Ensure clean state
git pull origin main

echo '🔙 Updating Backend...'
cd server
npm install
npx prisma generate
npx prisma db push --accept-data-loss
# Restart PM2 (Backend)
pm2 restart ahn-backend || pm2 start server.js --name 'ahn-backend'
pm2 save

echo '🎨 Building Frontend...'
cd ..
npm install
npm run build

echo '✅ Deployment Complete!'
"

# Execute via SSH with StrictHostKeyChecking disabled for automation
ssh -tt -o StrictHostKeyChecking=no "$TARGET" "$REMOTE_CMDS"
