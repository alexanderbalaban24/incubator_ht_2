import {genSalt, hash} from "bcrypt";
import {UsersCommandRepository} from "../repositories/users/users-command-repository";
import {UserDTO} from "./dtos";


export class UsersServices {

    constructor(protected usersCommandRepository: UsersCommandRepository){}
    async createUser(login: string, email: string, password: string, isConfirmed: boolean): Promise<string> {
        const passwordSalt = await genSalt(10);
        const passwordHash = await hash(password, passwordSalt);
        const newUser = new UserDTO(
            login,
            email,
            passwordHash,
            isConfirmed
        );

        return await this.usersCommandRepository.createUser(newUser);
    }
    async deleteUserById(userId: string): Promise<boolean> {
        return await this.usersCommandRepository.deleteUserById(userId);
    }
}