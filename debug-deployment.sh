#!/bin/bash
echo "=== Checking Docker Containers ==="
sudo docker ps -a

echo -e "\n=== Checking Backend Logs ==="
sudo docker logs zemen-backend --tail=50

echo -e "\n=== Checking Nginx Logs ==="
sudo docker logs zemen-nginx --tail=30

echo -e "\n=== Testing Backend from Inside Docker Network ==="
sudo docker exec zemen-nginx wget -qO- http://backend:8000/api/v1/health || echo "Failed to reach backend"

echo -e "\n=== Checking Nginx Config ==="
sudo docker exec zemen-nginx cat /etc/nginx/conf.d/default.conf
