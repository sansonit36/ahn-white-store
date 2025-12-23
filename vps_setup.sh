#!/bin/bash

# AHN White+ VPS Setup Script
# Run this on the VPS as root

set -e # Exit on error

REPO_URL="https://github.com/sansonit36/ahn-white-store.git"

echo "🚀 Starting VPS Setup..."

# 1. Update System
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# 2. Install Dependencies
echo "🛠 Installing Node.js, Nginx, Git, Certbot..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git certbot python3-certbot-nginx build-essential

# Verify Node
node -v
npm -v

# Install PM2
echo "⚙️ Installing PM2..."
npm install -g pm2

# 3. Setup Project Directory
echo "📂 Setting up project..."
mkdir -p /var/www
cd /var/www

if [ -d "ahn-store" ]; then
    echo "Repo exists, pulling latest..."
    cd ahn-store
    git pull
else
    git clone $REPO_URL ahn-store
    cd ahn-store
fi

# 4. Backend Setup
echo "🔙 Setting up Backend..."
cd server
npm install
npx prisma generate
npx prisma db push --accept-data-loss

# Start Backend
pm2 delete ahn-backend || true
pm2 start server.js --name "ahn-backend"
pm2 save
pm2 startup | bash || true 

# 5. Frontend Setup
echo "🎨 Setting up Frontend..."
cd .. # root of repo
npm install
npm run build

# 6. Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/ahn-store <<EOF
server {
    listen 80;
    server_name _; 

    root /var/www/ahn-store/dist;
    index index.html;

    # Frontend
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Site
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/ahn-store /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

echo "✅ Setup Complete!"
echo "👉 Your site should be live at: http://$(curl -s ifconfig.me)"
