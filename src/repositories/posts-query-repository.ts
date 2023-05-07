import {PostDB, postsCollections} from "../db/collections/postsCollections";
import {ViewPostModel} from "../models/post/ViewPostModel";

export const postsQueryRepository = {
    async findPost(): Promise<ViewPostModel[]> {
        const posts = await postsCollections.find({}, {projection: {_id: 0}}).toArray();

        return posts.map(post => this._mapPostDBToViewPostModel(post));
    },
    async findPostById(postId: string): Promise<ViewPostModel | null> {
        const post = await postsCollections.findOne({id: postId}, {projection: {_id: 0}});

        if (post) {
            return this._mapPostDBToViewPostModel(post);
        } else {
            return null;
        }
    },
    _mapPostDBToViewPostModel(post: PostDB): ViewPostModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}