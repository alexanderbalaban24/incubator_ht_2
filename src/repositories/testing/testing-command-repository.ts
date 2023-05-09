import {blogsCollections} from "../../db/collections/blogsCollections";
import {postsCollections} from "../../db/collections/postsCollections";
import {usersCollections} from "../../db/collections/usersCollections";

export const testingCommandRepository = {
    async deleteAllDB() {
        const resDeletedBlogs = await blogsCollections.deleteMany({});
        const resDeletedPosts = await postsCollections.deleteMany({});
        const resDeletedUsers = await usersCollections.deleteMany({});

        return resDeletedBlogs.deletedCount === 1 && resDeletedPosts.deletedCount === 1 && resDeletedUsers.deletedCount === 1;
    }
}