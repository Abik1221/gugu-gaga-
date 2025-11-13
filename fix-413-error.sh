#!/bin/bash

# Fix 413 Content Too Large error on production server
# Run this on your EC2 instance

echo "Updating nginx configuration to allow larger request bodies..."

# Backup current nginx config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Update nginx.conf to increase client_max_body_size
sudo sed -i '/http {/a\\tclient_max_body_size 50M;' /etc/nginx/nginx.conf

# Test nginx configuration
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid. Reloading nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully. 413 error should be fixed."
else
    echo "❌ Nginx configuration error. Restoring backup..."
    sudo cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
    echo "Backup restored. Please check the configuration manually."
fi