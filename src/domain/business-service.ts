import {emailManager} from "../managers/email-manager";
import {ConfirmationDataType} from "./auth-services";

export const businessService = {
    async doOperation(email: string, confirmationCode: string): Promise<boolean> {
    return await emailManager.sendEmailRegistrationMessage(email, confirmationCode);
    }
}