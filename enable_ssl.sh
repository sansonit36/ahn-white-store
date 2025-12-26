#!/bin/bash
TARGET=$1
DOMAIN="ahnskin.com"
EMAIL="info@ahnskin.com" # Used for urgent renewal notices

if [ -z "$TARGET" ]; then
  echo "Usage: ./enable_ssl.sh <user@ip>"
  exit 1
fi

echo "🔒 Enabling SSL for $DOMAIN on $TARGET..."

CMD="
set -e

# 1. Update Nginx with correct server_name
echo 'Adjusting Nginx config...'
cat > /etc/nginx/sites-available/ahn-store <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root /var/www/ahn-store/dist;
    index index.html;

    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

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

# Reload to apply server_name change
systemctl reload nginx

# 2. Run Certbot
echo 'Running Certbot...'
# --nginx: Use Nginx plugin
# --non-interactive: No prompts
# --agree-tos: Agree to terms
# --redirect: Auto-redirect HTTP to HTTPS
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

echo '✅ SSL Enabled! Access https://$DOMAIN'
"

ssh -tt -o StrictHostKeyChecking=no "$TARGET" "$CMD"
