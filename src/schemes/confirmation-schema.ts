import {checkSchema} from "express-validator";
import { isAfter } from 'date-fns'
import {container} from "../inversify.config";
import {AuthQueryRepository} from "../repositories/auth/auth-query-repository";

const authQueryRepository = container.resolve(AuthQueryRepository);

export const confirmationSchema = checkSchema({
    code: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        custom: {
            options: async (value: string) => {
                const userResult = await authQueryRepository.findUserByConfirmationCode(value);

                if(!userResult.success) {
                    return Promise.reject();
                }

                const confirmationResult = await authQueryRepository.findUserWithEmailConfirmationDataById(userResult.payload!.id);
                if(confirmationResult.payload!.isConfirmed || isAfter(new Date(), confirmationResult.payload!.expirationDate)) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field code should be exist and have expected format"
    }
}, ["body"])