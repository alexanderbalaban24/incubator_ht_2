import {genSalt, hash} from "bcrypt";
import {usersCommandRepository} from "../repositories/users/users-command-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";


export type UserType = {
    login: string
    email: string
    passwordHash: string,
    emailConfirmation: {
        confirmationCode: string
        expirationDate: string
        isConfirmed: boolean
    }
}


export const usersServices = {
    async createUser(login: string, email: string, password: string, isConfirmed: boolean): Promise<string> {
        const passwordSalt = await genSalt(10);
        const passwordHash = await hash(password, passwordSalt);
        const newUser: UserType = {
            login,
            email,
            passwordHash,
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 3}).toISOString(),
                isConfirmed: isConfirmed
            }
        };

        return await usersCommandRepository.createUser(newUser);
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return await usersCommandRepository.deleteUserById(userId);
    }
}