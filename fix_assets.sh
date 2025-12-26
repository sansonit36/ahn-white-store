#!/bin/bash
TARGET=$1

if [ -z "$TARGET" ]; then
  echo "Usage: ./fix_assets.sh <user@ip>"
  exit 1
fi

echo "🔧 Fixing Assets Loading on $TARGET..."

CMD="
# We need to insert the /uploads location block inside the SSL server block
# It's safer to overwrite the main config while preserving the Certbot managed lines via re-running certbot or simply copying the cert paths.
# However, modifying existing Certbot config with sed is risky. 
# Best approach: Re-write the file but include the known cert paths if they exist, or just append the location block if possible? 
# No, standard overwrite is cleanest, assuming we know the cert paths are standard.
# The previous 'cat' showed standard certbot paths.

cat > /etc/nginx/sites-available/ahn-store <<EOF
server {
    server_name ahnskin.com www.ahnskin.com;

    root /var/www/ahn-store/dist;
    index index.html;

    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }

    # Uploads Proxy (Fix for Images/Videos)
    location /uploads {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }

    # SSL Config (Preserved)
    listen 443 ssl; 
    ssl_certificate /etc/letsencrypt/live/ahnskin.com/fullchain.pem; 
    ssl_certificate_key /etc/letsencrypt/live/ahnskin.com/privkey.pem; 
    include /etc/letsencrypt/options-ssl-nginx.conf; 
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; 
}

# HTTP Redirect Block
server {
    if (\\\$host = www.ahnskin.com) {
        return 301 https://\\\$host\\\$request_uri;
    } 
    if (\\\$host = ahnskin.com) {
        return 301 https://\\\$host\\\$request_uri;
    } 
    listen 80;
    server_name ahnskin.com www.ahnskin.com;
    return 404; 
}
EOF

nginx -t && systemctl reload nginx
echo '✅ Nginx Assets Config Updated'
"

ssh -tt -o StrictHostKeyChecking=no "$TARGET" "$CMD"
