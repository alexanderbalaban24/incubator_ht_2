import {checkSchema} from "express-validator";
import {authQueryRepository} from "../repositories/auth/auth-query-repository";
import { isAfter } from 'date-fns'

export const confirmationSchema = checkSchema({
    code: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        custom: {
            options: async (value: string) => {
                const userId = await authQueryRepository.findUserByConfirmationCode(value);

                if(!userId) {
                    return Promise.reject();
                }

                const confirmationCode = await authQueryRepository.findUserWithConfirmationDataById(userId);
                if(confirmationCode?.isConfirmed || isAfter(new Date(), new Date(confirmationCode!.expirationDate))) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field code should be exist and have expected format"
    }
}, ["body"])