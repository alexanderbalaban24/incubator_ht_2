import {emailAdapter} from "../adapters/email-adapter";
import {ConfirmationDataType} from "../domain/auth-services";

export const emailManager = {
    async sendEmailRegistrationMessage(email: string, confirmationCode: string): Promise<boolean> {
        const message = "<h1>Thank for your registration</h1>" +
             "<p>To finish registration please follow the link below:" +
             `<a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>` +
             "</p>";

        const subject = "Registration Confirmation";

        return await emailAdapter.sendEmail(email, subject, message);
    }
}