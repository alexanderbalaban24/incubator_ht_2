import {BlogsModelClass} from "../../models/database/BlogsModelClass";
import {PostsModelClass} from "../../models/database/PostsModelClass";
import {UsersModelClass} from "../../models/database/UsersModelClass";
import {CommentsModelClass} from "../../models/database/CommentsModelClass";
import {DeviceModelClass} from "../../models/database/DeviceModelClass";
import {RateLimitModelClass} from "../../models/database/RateLimitModelClass";


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