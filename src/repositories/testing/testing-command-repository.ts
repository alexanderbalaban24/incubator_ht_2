import {blogsCollections} from "../../db/collections/blogsCollections";
import {postsCollections} from "../../db/collections/postsCollections";

export const testingCommandRepository = {
    async deleteAllDB() {
        const resDeletedBlogs = await blogsCollections.deleteMany({});
        const resDeletedPosts = await postsCollections.deleteMany({});

        return resDeletedBlogs.deletedCount === 1 && resDeletedPosts.deletedCount === 1;
    }
}