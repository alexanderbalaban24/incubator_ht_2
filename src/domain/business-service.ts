import {emailManager} from "../managers/email-manager";
import {EmailEvents, InternalCode} from "../shared/enums";
import {ResultDTO} from "../shared/dto";

export const businessService = {
    async doOperation(event: EmailEvents, email: string, code: string): Promise<ResultDTO<{ isSending: boolean }>> {
        let isSending: boolean;
    switch (event) {
        case EmailEvents.Registration:
            isSending = await emailManager.sendEmailRegistrationMessage(email, code);
            break;
        case EmailEvents.Recover_password:
            isSending = await emailManager.sendEmailRecoverPasswordMessage(email, code);
            break;
        default:
            isSending = false;
            break;
    }

    if (!isSending) return new ResultDTO(InternalCode.Server_Error);

    return new ResultDTO(InternalCode.Success, { isSending });
    }
}