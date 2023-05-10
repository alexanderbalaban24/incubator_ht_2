import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {commentsCommandRepository} from "../repositories/comments/comments-command-repository";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";

export type Comment = {
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
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
            },
            createdAt: new Date().toISOString()
        }

        return await commentsCommandRepository.createComment(newComment);
    },
    async deleteComment(commentId: string, userId: string): Promise<boolean> {
        const comment = await commentsQueryRepository.findCommentById(commentId);
        if (!comment) return false;

        if (comment.commentatorInfo.userId === userId) {
            return await commentsCommandRepository.deleteComment(commentId);
        } else {
            return false;
        }

    },
    async updateComment(commentId: string, content: string, userId: string): Promise<boolean> {
        const comment = await commentsQueryRepository.findCommentById(commentId);
        if (!comment) return false;

        if (comment.commentatorInfo.userId === userId) {
            return await commentsCommandRepository.updateComment(commentId, content);
        } else {
            return false;
        }

    }
}
