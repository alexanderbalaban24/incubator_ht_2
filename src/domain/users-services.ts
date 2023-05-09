import {genSalt, hash} from "bcrypt";
import {usersCommandRepository} from "../repositories/users/users-command-repository";


export type User = {
    login: string
    email: string
    passwordHash: string
    createdAt: string
}


export const usersServices = {
    async createUser(login: string, email: string, password: string): Promise<string> {
        const passwordSalt = await genSalt(10);
        const passwordHash = await hash(password, passwordSalt);
        const newUser: User = {login, email, passwordHash, createdAt: new Date().toISOString()};

        return await usersCommandRepository.createUser(newUser);
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return await usersCommandRepository.deleteUserById(userId);
    }
}