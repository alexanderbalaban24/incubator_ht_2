import {authQueryRepository} from "../repositories/auth/auth-query-repository";
import {compare} from "bcrypt";

export type UserInfo = {
    id: string
    passwordHash: string
}

export const authServices = {
    async login(loginOrEmail: string, password: string): Promise<string | null> {
        const userInfo = await authQueryRepository.searchUserByCredentials(loginOrEmail);

        if(userInfo) {
            const isValidCredentials = await compare(password, userInfo.passwordHash);

            if (isValidCredentials) {
                return userInfo.id;
            } else {
                return null;
            }
        } else {
            return null;
        }

    }
}