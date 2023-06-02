

export enum HTTPResponseStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500
}

export enum InternalCode {
    Success = "OK",
    Bad_Request = "BAD_REQUEST",
    Not_Found = "NOT_FOUND",
    Server_Error = "INTERNAL_SERVER_ERROR",
    No_Content = "NO_CONTENT",
    Unathorized = "UNAUTHORIZED",
    Created = "CREATED"
}

export enum EmailEvents {
    Registration,
    Recover_password
}