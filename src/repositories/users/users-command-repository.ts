import {UsersModelClass} from "../../models/user/UsersModelClass";
import {UserDTO} from "../../domain/dtos";


export class UsersCommandRepository {
    async createUser (user: UserDTO): Promise<string> {
    const result = await new UsersModelClass(user).save();

    return result._id.toString();
    }
    async deleteUserById(userId: string): Promise<boolean> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return false;

        const result = await userInstances.deleteOne();

        return result.$isDeleted();
    }
}