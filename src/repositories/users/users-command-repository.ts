import {UsersModelClass} from "../../models/database/UsersModelClass";
import {UserDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {injectable} from "inversify";

@injectable()
export class UsersCommandRepository {
    async createUser(user: UserDTO): Promise<ResultDTO<{ id: string }>> {
        const result = await new UsersModelClass(user).save();

        return new ResultDTO(InternalCode.Success, {id: result._id.toString()});
    }

    async deleteUserById(userId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return new ResultDTO(InternalCode.Not_Found);

        const result = await userInstances.deleteOne();

        const isDeleted = result.$isDeleted();

        if (!isDeleted) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Success, {isDeleted});
    }
}