import {BlogsModel, CommentsModel, DeviceModel, PostsModel, RateLimitModel, UsersModel} from "../../db";


export const testingCommandRepository = {
    async deleteAllDB(): Promise<boolean> {
        try {
            const deletedResult = await Promise.all([
                BlogsModel.deleteMany({}),
                PostsModel.deleteMany({}),
                UsersModel.deleteMany({}),
                CommentsModel.deleteMany({}),
                DeviceModel.deleteMany({}),
                RateLimitModel.deleteMany({})
            ]);
            return deletedResult.every(item => item.deletedCount === 1);
        } catch (e) {
            return false;
        }
    }
}