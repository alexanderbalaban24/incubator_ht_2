import {InternalCode} from "./enums";

export class ResultDTO<T> {

    public success: boolean;
    public payload: T | null;
    constructor(public code: InternalCode, payload: T | null = null) {
        if(payload) {
            this.payload = payload;
            this.success = true;
        } else {
            this.payload = null;
            this.success = false;
        }
    }

}

export class QueryBuildDTO<T, C> {

    public items: C[] | null = null;
    #itemsDB: T[];

    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        itemsDB: T[]
    ) {
        this.#itemsDB = itemsDB;
    }

    map(cb: (val: T) => C) {
        this.items = this.#itemsDB.map(el => cb(el));
    }
}