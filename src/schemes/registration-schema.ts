import {checkSchema} from "express-validator";
import {authQueryRepository} from "../composition-root";

export const registrationValidateSchema = checkSchema({
    login: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {min: 3, max: 10}, errorMessage: "Field login should be length minimum 3 and maximum 10"},
        escape: true,
        matches: {
            options: "^[a-zA-Z0-9_-]*$"
        },
        custom: {
            options: async (value) => {
                const user = await authQueryRepository.searchUserByCredentials(value);

                if (user) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field login should be exist and have expected format"
    },
    email: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        matches: {
            options: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
        },
        custom: {
            options: async (value) => {
                const user = await authQueryRepository.searchUserByCredentials(value);

                if (user) {
                    return Promise.reject();
                }
            }
        },
        errorMessage: "Field email should be exist and have expected format"
    },
    password: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {
            options: {min: 6, max: 20},
            errorMessage: "Field password should be length minimum 3 and maximum 10"
        },
        escape: true,
        errorMessage: "Field password should be exist and have expected format"
    }
}, ["body"])