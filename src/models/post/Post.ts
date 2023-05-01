import {PostType} from "../../shared/types";


export class Post implements PostType {

    public id: string = new Date().toISOString();

    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string
    ){}
}