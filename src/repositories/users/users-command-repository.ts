import {UserType} from "../../domain/users-services";
import {usersCollections} from "../../db/collections/usersCollections";
import {ObjectId} from "mongodb";


export const usersCommandRepository = {
    async createUser (user: UserType): Promise<string> {
    const result = await usersCollections.insertOne(user);

    return result.insertedId.toString();
    },
    async deleteUserById(userId: string): Promise<boolean> {
        const result = await usersCollections.deleteOne({_id: new ObjectId(userId)});

        return result.deletedCount === 1;
    }
}