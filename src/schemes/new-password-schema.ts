import {checkSchema} from "express-validator";
import {isAfter} from "date-fns";
import {authQueryRepository} from "../composition-root";

export const newPasswordSchema = checkSchema({
    newPassword: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: {min: 6, max: 20}, errorMessage: "Password should be length min 6 max 20" },
        escape: true
    },
    recoveryCode: {
        isString: true,
        trim: true,
        notEmpty: true,
        custom: {
            options: async (value: string) => {
                const userId = await authQueryRepository.findUserByConfirmationCode(value);
                if(!userId) {
                    return Promise.reject();
                }

                const confirmationData = await authQueryRepository.findUserWithPasswordRecoverConfirmationDataById(userId);
                if(confirmationData?.isConfirmed || isAfter(new Date(), confirmationData!.expirationDate)) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field recoveryCode should be exist and have expected format"
    }
})