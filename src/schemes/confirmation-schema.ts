import {checkSchema} from "express-validator";
import { isAfter } from 'date-fns'
import {authQueryRepository} from "../composition-root";

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

                const confirmationData = await authQueryRepository.findUserWithEmailConfirmationDataById(userId);
                if(confirmationData?.isConfirmed || isAfter(new Date(), confirmationData!.expirationDate)) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field code should be exist and have expected format"
    }
}, ["body"])