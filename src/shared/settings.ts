import dotenv from "dotenv";

dotenv.config()
export const settings = {
    port: process.env.PORT,
    admin_login: process.env.LOGIN || "admin",
    admin_password: process.env.PASS || "qwerty",
    mongo_url: process.env.MONGO_URL,
    jwt_secret: process.env.JWT_SECRET,
    admin_gmail: process.env.GMAIL,
    admin_gmail_app_key: process.env.GMAIL_PASS
}