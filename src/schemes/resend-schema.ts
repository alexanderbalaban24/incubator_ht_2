import {checkSchema} from "express-validator";
import {container} from "../inversify.config";
import {AuthQueryRepository} from "../repositories/auth/auth-query-repository";

const authQueryRepository = container.resolve(AuthQueryRepository);

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
                const confirmationDataResult = await authQueryRepository.findUserWithConfirmationDataByEmail(value);
                if (!confirmationDataResult.success) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field email should be exist and have expected format"
    },
}, ["body"])