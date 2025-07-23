#!/bin/bash

echo "👉 Starting MariaDB..."
sudo service mysql start

# Or for MariaDB specifically (sometimes it's still 'mysql')
sudo service mariadb start

echo "👉 Starting Redis..."
sudo service redis-server start

echo "👉 Starting PM2 processes..."
# Replace with your actual PM2 process name or ecosystem config
pm2 start backend/index.js --name api-gateway

echo "👉 Reloading Nginx..."
sudo nginx -s reload

echo "✅ All services started!"
