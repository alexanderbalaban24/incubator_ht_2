import {genSalt, hash} from "bcrypt";
import {UsersCommandRepository} from "../repositories/users/users-command-repository";
import {UserDTO} from "./dtos";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";
import {inject, injectable} from "inversify";


@injectable()
export class UsersServices {

    constructor(@inject(UsersCommandRepository) protected usersCommandRepository: UsersCommandRepository){}
    async createUser(login: string, email: string, password: string, isConfirmed: boolean): Promise<ResultDTO<{ id: string }>> {
        const passwordSalt = await genSalt(10);
        const passwordHash = await hash(password, passwordSalt);
        const newUser = new UserDTO(
            login,
            email,
            passwordHash,
            isConfirmed
        );

        const userResult = await this.usersCommandRepository.createUser(newUser);
        if (!userResult.success) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Created, { id: userResult.payload!.id });
    }
    async deleteUserById(userId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const deletedResult = await this.usersCommandRepository.deleteUserById(userId);
        if(!deletedResult.success) return new ResultDTO(deletedResult.code);

        return new ResultDTO(InternalCode.No_Content, deletedResult.payload);
    }
}