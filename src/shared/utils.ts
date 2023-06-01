import {HTTPResponseStatusCodes, InternalCode} from "./enums";

export const mapStatusCode = (internalCode: InternalCode) => {
    const code = HTTPResponseStatusCodes[internalCode];
    if (!code) return HTTPResponseStatusCodes.INTERNAL_SERVER_ERROR;

    return code;
}

export const VALID_BLOG_DATA = {
    name: "test auth",
    description: "string descriptin",
    websiteUrl: "https://tdfddddt.qq"
}

export const VALID_POST_DATA = {
    title: "test title",
    shortDescription: "test post shortDescription",
    content: "test post content"
}

export const INVALID_VALUE = "";