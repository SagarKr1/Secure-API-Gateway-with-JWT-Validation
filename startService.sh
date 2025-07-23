#!/bin/bash

echo "👉 Starting MariaDB..."
sudo service mysql start
sudo service mariadb start

echo "👉 Starting Redis..."
sudo service redis-server start

echo "👉 Starting PM2..."
pm2 start ecosystem.config.js

echo "👉 Reloading Nginx..."
sudo nginx -s reload

echo "✅ All services started!"
