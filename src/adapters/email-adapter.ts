import nodemailer from "nodemailer";
import {settings} from "../shared/settings";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string): Promise<boolean> {
        const gmail = settings.admin_gmail;
        const pass = settings.admin_gmail_app_key;

        const transport = await nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: gmail,
                pass: pass
            }
        });

        return new Promise((resolve, reject) => {
            transport.sendMail({
                from: `"Alex" <${gmail}>`,
                to: email,
                subject: subject,
                html: message
            }, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(false);
                } else {
                    console.log(info);
                    resolve(true);
                }
            })
        })
    }
}