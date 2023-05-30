import {BlogsModelClass, CommentsModelClass, DeviceModelClass, PostsModelClass, RateLimitModelClass, UsersModelClass} from "../../db";


export class TestingCommandRepository {
    async deleteAllDB(): Promise<boolean> {
        try {
            const deletedResult = await Promise.all([
                BlogsModelClass.deleteMany({}),
                PostsModelClass.deleteMany({}),
                UsersModelClass.deleteMany({}),
                CommentsModelClass.deleteMany({}),
                DeviceModelClass.deleteMany({}),
                RateLimitModelClass.deleteMany({})
            ]);
            return deletedResult.every(item => item.deletedCount === 1);
        } catch (e) {
            return false;
        }
    }
}