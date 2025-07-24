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

