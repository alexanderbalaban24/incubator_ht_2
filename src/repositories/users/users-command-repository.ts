import {UserType} from "../../domain/users-services";
import {UsersModelClass} from "../../db";


export const usersCommandRepository = {
    async createUser (user: UserType): Promise<string> {
    const result = await new UsersModelClass(user).save();

    return result._id.toString();
    },
    async deleteUserById(userId: string): Promise<boolean> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return false;

        const result = await userInstances.deleteOne();

        return result.$isDeleted();
    }
}