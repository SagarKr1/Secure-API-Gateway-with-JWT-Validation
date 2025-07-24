module.exports = {
    apps: [
        {
            name: "api-gateway",
            script: "backend/index.js",
            env: {
                PORT: <PORT>,
                MYSQL_USER: <Myql-User>,
                MYSQL_PASSWORD: <Mysql-Password>,
                MYSQL_HOST: <Host-Name>,
                DATABASE: "Blog",
                SECRET_KEY: <Secret-Key>,
                JWT_SECRET: <JWT-Secret>,
                FRONTEND_BASE_URL: <frontend-Url>,
                email: <Email>,
                pass:<Pass-Key>,
                REDIS_URL: <Redis-Url>
            }
        }
    ]
};
