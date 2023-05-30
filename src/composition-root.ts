import {BlogsQueryRepository} from "./repositories/blogs/blogs-query-repository";
import {BlogsCommandRepository} from "./repositories/blogs/blogs-command-repository";
import {BlogsServices} from "./domain/blogs-services";
import {BlogsController} from "./controllers/blogs.controller";
import {PostsQueryRepository} from "./repositories/posts/posts-query-repository";
import {PostsCommandRepository} from "./repositories/posts/posts-command-repository";
import {PostsServices} from "./domain/posts-services";
import {PostsController} from "./controllers/posts.controller";
import {CommentsQueryRepository} from "./repositories/comments/comments-query-repository";
import {CommentsCommandRepository} from "./repositories/comments/comments-command-repository";
import {CommentsServices} from "./domain/comments-services";
import {CommentsController} from "./controllers/comments.controller";
import {UsersQueryRepository} from "./repositories/users/users-query-repository";
import {UsersCommandRepository} from "./repositories/users/users-command-repository";
import {UsersServices} from "./domain/users-services";
import {UsersController} from "./controllers/users.controller";
import {AuthQueryRepository} from "./repositories/auth/auth-query-repository";
import {AuthCommandRepository} from "./repositories/auth/auth-command-repository";
import {AuthServices} from "./domain/auth-services";
import {AuthController} from "./controllers/auth.controller";
import {DevicesQueryRepository} from "./repositories/securityDevices/devices-query-repository";
import {DevicesCommandRepository} from "./repositories/securityDevices/devices-command-repository";
import {SecurityServices} from "./domain/security-services";
import {SecurityController} from "./controllers/security.controller";
import {TestingCommandRepository} from "./repositories/testing/testing-command-repository";
import {TestingController} from "./controllers/testing.controller";


export const postsQueryRepository = new PostsQueryRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const authQueryRepository = new AuthQueryRepository();
export const devicesQueryRepository = new DevicesQueryRepository();

const postsCommandRepository = new PostsCommandRepository();
const blogsCommandRepository = new BlogsCommandRepository();
const commentsCommandRepository = new CommentsCommandRepository();
const usersCommandRepository = new UsersCommandRepository();
const authCommandRepository = new AuthCommandRepository();
const devicesCommandRepository = new DevicesCommandRepository();
const testingCommandRepository = new TestingCommandRepository();

export const postsServices = new PostsServices(postsCommandRepository);
const blogsServices = new BlogsServices(blogsCommandRepository);
const commentsServices = new CommentsServices(commentsCommandRepository, postsQueryRepository);
export const usersServices = new UsersServices(usersCommandRepository);
const securityServices = new SecurityServices(devicesCommandRepository);
export const authServices = new AuthServices(authQueryRepository, authCommandRepository, securityServices, devicesQueryRepository);

export const postsController = new PostsController(postsServices, postsQueryRepository, commentsServices, commentsQueryRepository);
export const blogsController = new BlogsController(blogsServices, blogsQueryRepository, postsServices, postsQueryRepository);
export const commentsController = new CommentsController(commentsServices, commentsQueryRepository);
export const usersController = new UsersController(usersServices, usersQueryRepository);
export const authController = new AuthController(authServices);
export const securityController = new SecurityController(securityServices, devicesCommandRepository, devicesQueryRepository);
export const testingController = new TestingController(testingCommandRepository);