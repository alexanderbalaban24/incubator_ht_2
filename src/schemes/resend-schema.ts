import {checkSchema} from "express-validator";
import {authQueryRepository} from "../repositories/auth/auth-query-repository";


export const resendSchema = checkSchema({
    email: {
        isString: true,
        trim: true,
        notEmpty: true,
        matches: {
            options: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
        },
        custom: {
            options: async (value) => {
                const confirmationData = await authQueryRepository.findUserWithConfirmationDataByEmail(value);
                if (!confirmationData || confirmationData.isConfirmed) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field email should be exist and have expected format"
    },
}, ["body"])