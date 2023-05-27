import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {commentsCommandRepository} from "../repositories/comments/comments-command-repository";

export type Comment = {
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
}

export const commentsServices = {
    async createComment(postId: string, content: string, userId: string): Promise<string | null> {
        const post = await postsQueryRepository.findPostById(postId);
        if (!post) return null;

        const user = await usersQueryRepository.findUserById(userId);
        if (!user) return null;

        const newComment: Comment = {
            postId: post.id,
            content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            }
        }

        return await commentsCommandRepository.createComment(newComment);
    },
    async deleteComment(commentId: string): Promise<boolean> {
            return await commentsCommandRepository.deleteComment(commentId);

    },
    async updateComment(commentId: string, content: string): Promise<boolean> {
            return await commentsCommandRepository.updateComment(commentId, content);

    }
}
