import {LoginModel} from "../models/auth/LoginModel";
import {authQueryRepository} from "../repositories/auth/auth-query-repository";
import {compare} from "bcrypt";


export const authServices = {
    async login(loginOrEmail: string, password: string): Promise<boolean> {
        const passwordHash = await authQueryRepository.searchUserByCredentials(loginOrEmail);

        if(passwordHash) {
            return await compare(password, passwordHash);
        } else {
            return false;
        }

    }
}