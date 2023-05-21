import {blogsCollections} from "../../db/collections/blogsCollections";
import {postsCollections} from "../../db/collections/postsCollections";
import {usersCollections} from "../../db/collections/usersCollections";
import {commentsCollections} from "../../db/collections/commentsCollections";
import {deviceSecureCollections} from "../../db/collections/deviceSecureCollections";

export const testingCommandRepository = {
    async deleteAllDB() {
        const resDeletedBlogs = await blogsCollections.deleteMany({});
        const resDeletedPosts = await postsCollections.deleteMany({});
        const resDeletedUsers = await usersCollections.deleteMany({});
        const resDeletedComments = await commentsCollections.deleteMany({});
        const resDeletedDevices = await deviceSecureCollections.deleteMany({});

        return resDeletedBlogs.deletedCount === 1 && resDeletedPosts.deletedCount === 1 && resDeletedUsers.deletedCount === 1 && resDeletedComments.deletedCount === 1 && resDeletedDevices.deletedCount === 1;
    }
}