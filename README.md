# Secure API Gateway with JWT Validation

## 📌 Project Summary

The **Secure API Gateway** project is designed to enforce robust **authentication**, **authorization**, **rate limiting**, and **secure traffic forwarding** for your microservices architecture. It provides a single entry point to your backend APIs with multiple security layers.

---

## 🎯 Objective

Build a secure API gateway to:
- ✅ Validate JWTs with **role-based access control**.
- ✅ Apply **IP throttling** using **Redis**.
- ✅ Log **requests & responses** with timestamps for auditing.
- ✅ Offload TLS and enforce **HTTPS** (self-signed certificate).
- ✅ Detect abuse and send alerts.
- ✅ Provide a **dashboard** for monitoring API usage and system health.

---

## 🛠️ Tech Stack

- **Backend:** Node.js (Express)
- **Frontend:** React.js (MUI)
- **Security:** JWT, OAuth2 (extension, optional)
- **Rate Limiting:** Redis
- **Web Server:** Linux, SystemD, Nginx (for TLS offloading)
- **Monitoring:** Dashboard with logs & alert system

---

## 📌 Features

- **🔑 JWT Validation:** Role-based access for users, admins, or services.
- **🚦 Rate Limiting:** Block excessive requests from abusive IPs.
- **📜 Logging:** Persistent request & response logs with timestamps.
- **🔒 HTTPS/TLS:** Self-signed certificate configuration with Nginx.
- **📊 Dashboard:** Real-time metrics, logs, and usage stats.
- **⚠️ Alerts:** Abuse detection with automatic alerts.

---

## 🧩 Architecture Diagram

> ![Architecture Diagram](./Images/Design.png)  
> *(Replace with your actual diagram image)*

---

## 🚀 Project Structure

```plaintext
secure-api-gateway/
├── backend/
│   ├── auth/
│   ├── config/
│   ├── controllers/
│   ├── logs/
│   ├── node_modules/
│   ├── routes/
│   ├── scripts/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── redis.js
│
├── frontend/
│   ├── build/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── 3000
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│
├── Nginx/
│   ├── default-site.config
│   ├── nginx.config
|   ├── ssl/

```

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/secure-api-gateway.git
cd secure-api-gateway
```

---

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

### 4️⃣ Install Redis

# Ubuntu example
```bash
sudo apt update
sudo apt install redis-server
```

# Enable & start Redis
```bash
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

---

### 5️⃣ Install MySQL

# Ubuntu example
```bash
sudo apt update
sudo apt install mysql-server
```
# Enable & start MySQL
```bash
sudo systemctl enable mysql
sudo systemctl start mysql
```

Create your database and user in MySQL:

```sql
CREATE DATABASE secure_gateway;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON secure_gateway.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

### 6️⃣ Install PM2 (Optional but Recommended)

> PM2 is a process manager for Node.js — it keeps your app alive & restarts it on crashes.

```bash
sudo npm install -g pm2
```
# Start your backend with PM2
```bash
cd backend
pm2 start index.js --name secure-api-gateway
```
# Optional: save & startup script
```bash
pm2 save
pm2 startup
```

---

### 7️⃣ Install & Setup Nginx

```bash
sudo apt update
sudo apt install nginx
```
# Enable & start Nginx
```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### 8️⃣ Configure Environment Variables

Create a `.env` file in your `/backend` folder and add:

```env
PORT=3000
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=secure_gateway
```

---

### 9️⃣ Generate Self-Signed TLS Certificate

Inside your `/etc/nginx/ssl/` folder, run:

```bash
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout Nginx/ssl/server.key \
  -out Nginx/ssl/server.crt
```

---

### 🔟 Setup & Configure Nginx

Your **Secure API Gateway** uses **Nginx** for:
- TLS/SSL offloading (HTTPS)
- Proxying API requests to Node.js backend
- Serving React frontend (optional)

---

#### 📁 Nginx Config Files

- Main config: `/etc/nginx/nginx.conf`  
- Site config: `/etc/nginx/sites-available/default`  
  (or `/etc/nginx/conf.d/secure-gateway.conf`)

---

#### 📝 Example `nginx.conf`

\```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  sendfile        on;
  keepalive_timeout 65;

  server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    ssl_protocols TLSv1.2 TLSv1.3;

    location /api/ {
      proxy_pass http://127.0.0.1:8080/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
      root /var/www/html; # or your frontend build folder
      try_files $uri /index.html;
    }
  }
}
\```

---

#### ✅ Test & Reload Nginx

Test your config:

Start Nginx
```bash
sudo systemctl start nginx
```

Check Status
```bash
sudo nginx -t
```

Reload or restart:

```bash
sudo systemctl reload nginx
```
# or
```bash
sudo systemctl restart nginx
```

---

✅ **Done!** Now your Secure API Gateway runs behind HTTPS with:
- Node.js + PM2
- Redis
- MySQL
- Nginx (TLS + proxy)

You’re production-ready! 🚀

---

### ⚠️ Note for External Database & Redis

If you use **external servers** for **MySQL** or **Redis** (like AWS RDS, AWS Elasticache, or any managed service):

- Replace `localhost` with the **hostname or IP** of your external MySQL/Redis server in your `.env`:
  ```env
  MYSQL_HOST=your-external-mysql-host
  REDIS_HOST=your-external-redis-host
```


