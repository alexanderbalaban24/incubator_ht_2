import {emailAdapter} from "../adapters/email-adapter";

import {ConfirmationDataType} from "../domain/types";

export const emailManager = {
    async sendEmailRegistrationMessage(email: string, confirmationCode: string): Promise<boolean> {
        const message = "<h1>Thank for your registration</h1>" +
             "<p>To finish registration please follow the link below:" +
             `<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>` +
             "</p>";

        const subject = "Registration Confirmation";

        return await emailAdapter.sendEmail(email, subject, message);
    },
    async sendEmailRecoverPasswordMessage(email: string, recoverCode: string): Promise<boolean> {
        const message = "<h1>Password recovery</h1>\n" +
            "       <p>To finish password recovery please follow the link below:\n" +
            `          <a href='https://somesite.com/password-recovery?recoveryCode=${recoverCode}'>recovery password</a>\n` +
            "      </p>";

        const subject = "Password recover";

        return await emailAdapter.sendEmail(email, subject, message);
    }
}