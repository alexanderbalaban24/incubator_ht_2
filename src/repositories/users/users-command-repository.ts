import {UserType} from "../../domain/users-services";
import {ObjectId} from "mongodb";
import {UsersModel} from "../../db";


export const usersCommandRepository = {
    async createUser (user: UserType): Promise<string> {
    const result = await new UsersModel(user).save();

    return result._id.toString();
    },
    async deleteUserById(userId: string): Promise<boolean> {
        const result = await UsersModel.deleteOne({_id: new ObjectId(userId)});

        return result.deletedCount === 1;
    }
}