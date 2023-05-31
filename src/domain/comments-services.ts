import {CommentsCommandRepository} from "../repositories/comments/comments-command-repository";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";
import {usersQueryRepository} from "../composition-root";
import {CommentDTO} from "./dtos";

export class CommentsServices {

    constructor(protected commentsCommandRepository: CommentsCommandRepository, protected postsQueryRepository: PostsQueryRepository){}

    async createComment(postId: string, content: string, userId: string): Promise<string | null> {
        const post = await this.postsQueryRepository.findPostById(postId);
        if (!post) return null;

        const user = await usersQueryRepository.findUserById(userId);
        if (!user) return null;

        const newComment = new CommentDTO(post.id, content, userId, user.login);

        return await this.commentsCommandRepository.createComment(newComment);
    }
    async deleteComment(commentId: string): Promise<boolean> {
            return await this.commentsCommandRepository.deleteComment(commentId);

    }
    async updateComment(commentId: string, content: string): Promise<boolean> {
            return await this.commentsCommandRepository.updateComment(commentId, content);

    }
}
