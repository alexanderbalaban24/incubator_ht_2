import {BlogType} from "../../shared/types";

export class Blog implements BlogType {

public id: string = new Date().toISOString();

    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string = new Date().toISOString(),
        public isMembership: boolean = false
    ) {}
}