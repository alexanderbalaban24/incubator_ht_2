import {authQueryRepository} from "../repositories/auth/auth-query-repository";
import {compare} from "bcrypt";
import {usersServices} from "./users-services";
import {businessService} from "./business-service";
import {authCommandRepository} from "../repositories/auth/auth-command-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export type ConfirmationDataType = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}

export type UserInfoType = {
    id: string,
    passwordHash: string
}


export const authServices = {
    async login(loginOrEmail: string, password: string): Promise<string | null> {
        const userInfo = await authQueryRepository.searchUserByCredentials(loginOrEmail);

        if (userInfo) {
            const isValidCredentials = await compare(password, userInfo.passwordHash);

            if (isValidCredentials) {
                return userInfo.id;
            } else {
                return null;
            }
        } else {
            return null;
        }

    },
    async registration(login: string, email: string, password: string): Promise<boolean> {
        const userId = await usersServices.createUser(login, email, password, false);
        if (!userId) return false;

        const confirmationData = await authQueryRepository.findUserWithConfirmationDataById(userId);
        if (!confirmationData) return false;

        const success = await businessService.doOperation(email, confirmationData.confirmationCode);

        if (success) {
            return true;
        } else {
            await usersServices.deleteUserById(userId);
            return false;
        }
    },
    async verifyEmail(code: string): Promise<boolean> {
        const userId = await authQueryRepository.findUserByConfirmationCode(code);

        if (userId) {
            return await authCommandRepository.updateIsConfirmedFieldById(userId);
        } else {
            return false;
        }
    },
    async resendConfirmationCode(email: string): Promise<boolean> {
        const confirmationCode = uuidv4();
        const expirationDate = add(new Date(), {hours: 3}).toISOString();

        const isUpdate = await authCommandRepository.updateConfirmationDataByEmail(email, confirmationCode, expirationDate);
        if (!isUpdate) return false;

        return await businessService.doOperation(email, confirmationCode);
    }
}