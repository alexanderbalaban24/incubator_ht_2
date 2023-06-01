import {CommentsCommandRepository} from "../repositories/comments/comments-command-repository";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";
import {CommentDTO} from "./dtos";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";

export class CommentsServices {

    constructor(protected commentsCommandRepository: CommentsCommandRepository, protected postsQueryRepository: PostsQueryRepository, protected usersQueryRepository: UsersQueryRepository) {
    }

    async createComment(postId: string, content: string, userId: string): Promise<ResultDTO<{ id: string }>> {
        const postResult = await this.postsQueryRepository.findPostById(postId);
        if (!postResult.success) return new ResultDTO(InternalCode.Not_Found);

        const userResult = await this.usersQueryRepository.findUserById(userId);
        if (!userResult.success) return new ResultDTO(InternalCode.Not_Found);

        const newComment = new CommentDTO(userResult.payload!.id, content, userId, userResult.payload!.login);

        const commentResult = await this.commentsCommandRepository.createComment(newComment);

        if (commentResult.success) {
            return new ResultDTO(InternalCode.Success, postResult.payload);
        } else {
            return new ResultDTO(commentResult.code);
        }
    }

    async deleteComment(commentId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const deleteResult = await this.commentsCommandRepository.deleteComment(commentId);

        if (deleteResult.success) {
            return new ResultDTO(InternalCode.No_Content, deleteResult.payload);
        } else {
            return new ResultDTO(deleteResult.code);
        }

    }

    async updateComment(commentId: string, content: string): Promise<ResultDTO<{ isUpdate: boolean }>> {
        const updateResult = await this.commentsCommandRepository.updateComment(commentId, content);

        if (updateResult.success) {
            return new ResultDTO(InternalCode.No_Content, updateResult.payload);
        } else {
            return new ResultDTO(updateResult.code);
        }

    }
}
