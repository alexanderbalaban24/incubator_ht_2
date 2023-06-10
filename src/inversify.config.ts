import "reflect-metadata";
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
import {RateLimitQueryRepository} from "./repositories/rateLimit/rateLimit-query-repository";
import {RateLimitCommandRepository} from "./repositories/rateLimit/rateLimit-command-repository";
import {RateLimitServices} from "./application/rateLimit-services";
import {Container} from "inversify";
import {ResponseHelper} from "./shared/helpers";


export const container = new Container();
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(AuthQueryRepository).to(AuthQueryRepository);
container.bind(DevicesQueryRepository).to(DevicesQueryRepository);
container.bind(RateLimitQueryRepository).to(RateLimitQueryRepository);

container.bind(PostsCommandRepository).to(PostsCommandRepository);
container.bind(BlogsCommandRepository).to(BlogsCommandRepository);
container.bind(CommentsCommandRepository).to(CommentsCommandRepository);
container.bind(UsersCommandRepository).to(UsersCommandRepository);
container.bind(AuthCommandRepository).to(AuthCommandRepository);
container.bind(DevicesCommandRepository).to(DevicesCommandRepository);
container.bind(TestingCommandRepository).to(TestingCommandRepository);
container.bind(RateLimitCommandRepository).to(RateLimitCommandRepository);

container.bind(PostsServices).to(PostsServices);
container.bind(BlogsServices).to(BlogsServices);
container.bind(CommentsServices).to(CommentsServices);
container.bind(UsersServices).to(UsersServices);
container.bind(SecurityServices).to(SecurityServices);
container.bind(AuthServices).to(AuthServices);
container.bind(RateLimitServices).to(RateLimitServices);

container.bind(PostsController).to(PostsController);
container.bind(BlogsController).to(BlogsController);
container.bind(CommentsController).to(CommentsController);
container.bind(UsersController).to(UsersController);
container.bind(AuthController).to(AuthController);
container.bind(SecurityController).to(SecurityController);
container.bind(TestingController).to(TestingController);

container.bind(ResponseHelper).to(ResponseHelper);