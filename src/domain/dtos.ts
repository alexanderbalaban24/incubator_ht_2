import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {addMilliseconds} from "date-fns";

import {LikeStatusEnum} from "../models/database/CommentsModelClass";

export class RecoveryPasswordDTO {
    public confirmationCode: string;
    public expirationDate: Date;
    public isConfirmed: boolean;

    constructor() {
        this.confirmationCode = uuidv4();
        this.expirationDate = add(new Date, {hours: 3})
        this.isConfirmed = false
    }
}

export class BlogDTO {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string
    ) {
    }
}

export class UsersLikesDTO {
    constructor(
        public userId: string,
        public likeStatus: LikeStatusEnum,
        public likedAt: Date
    ){}
}

export class CommentDTO {

    public commentatorInfo: { userId: string, userLogin: string };
    public likesCount: number = 0;
    public dislikesCount: number = 0;
    public usersLikes: UsersLikesDTO[] = [];
    public createdAt: Date

    constructor(
        public postId: string,
        public content: string,
        userId: string,
        userLogin: string
    ) {
        this.likesCount = 0;
        this.dislikesCount = 0;
        this.commentatorInfo = {userId, userLogin};
        this.createdAt = new Date;
    }
}

export class PostDTO {

    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
    ) {
    }
}

export class DeviceDTO {

    public issuedAt: Date;
    public expirationAt: Date;


    constructor(
        public userId: string,
        public deviceName: string,
        public ip: string,
        expiration: number
    ) {
        this.issuedAt = new Date();
        this.expirationAt = addMilliseconds(new Date(), expiration);
    }
}

type Confirmation = { confirmationCode: string, expirationDate: Date, isConfirmed: boolean }

export class UserDTO {

    public emailConfirmation: Confirmation;
    public passwordRecover: Confirmation;

    constructor(
        public login: string,
        public email: string,
        public passwordHash: string,
        isConfirmed: boolean
    ) {
        this.emailConfirmation = {confirmationCode: uuidv4(), expirationDate: add(new Date(), {hours: 3}), isConfirmed};
        this.passwordRecover = {confirmationCode: uuidv4(), expirationDate: new Date(), isConfirmed: false};
    }
}

export class TokenPairDTO {

    constructor(public accessToken: string, public refreshToken: string) {
    }
}