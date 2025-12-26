#!/bin/bash
TARGET=$1

if [ -z "$TARGET" ]; then
  echo "Usage: ./fix_nginx.sh <user@ip>"
  exit 1
fi

echo "🔧 Fixing Nginx on $TARGET..."

CMD="
cat > /etc/nginx/sites-available/ahn-store <<EOF
server {
    listen 80;
    server_name _; 

    root /var/www/ahn-store/dist;
    index index.html;

    # Frontend - KEY FIX: Redirect 404s to index.html for SPA
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
EOF

# Sanity check and restart
nginx -t && systemctl restart nginx
echo '✅ Nginx Configuration Updated and Restarted'
"

ssh -tt -o StrictHostKeyChecking=no "$TARGET" "$CMD"
