import {emailManager} from "../managers/email-manager";
import {ConfirmationDataType} from "./auth-services";
import {EmailEvents} from "../shared/enums";

export const businessService = {
    async doOperation(event: EmailEvents, email: string, code: string): Promise<boolean> {
    switch (event) {
        case EmailEvents.Registration:
            return await emailManager.sendEmailRegistrationMessage(email, code);
        case EmailEvents.Recover_password:
            return await emailManager.sendEmailRecoverPasswordMessage(email, code);
        default:
            return false;
    }
    }
}