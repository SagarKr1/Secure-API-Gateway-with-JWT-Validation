module.exports = {
    apps: [
        {
            name: "api-gateway",
            script: "backend/index.js",
            env: {
                PORT: 8080,
                MYSQL_USER: "root",
                MYSQL_PASSWORD: "Sagar@1234",
                MYSQL_HOST: "localhost",
                DATABASE: "Blog",
                SECRET_KEY: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
                JWT_SECRET: "789abcdef0123456789abcde",
                FRONTEND_BASE_URL: "https://localhost",
                email: "noreply.p5digital@gmail.com",
                pass: "olst bumm nryh fmef",
                REDIS_URL: "redis://127.0.0.1:6379"
            }
        }
    ]
};
