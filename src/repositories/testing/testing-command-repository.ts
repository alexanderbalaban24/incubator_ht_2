import {BlogsModelClass} from "../../models/blog/BlogsModelClass";
import {PostsModelClass} from "../../models/post/PostsModelClass";
import {UsersModelClass} from "../../models/user/UsersModelClass";
import {CommentsModelClass} from "../../models/comment/CommentsModelClass";
import {DeviceModelClass} from "../../models/device/DeviceModelClass";
import {RateLimitModelClass} from "../../models/rateLimit/RateLimitModelClass";


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