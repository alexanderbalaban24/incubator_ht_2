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