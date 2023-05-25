import {validationResult} from "express-validator";
import {ErrorType, RequestEmpty, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const inputValidationMiddleware = (req: RequestEmpty, res: ResponseEmpty, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        const resultError: ErrorType[] = errors.array({onlyFirstError: true}).map((err) => {
            if (err.type === 'field') {
                return {
                    message: err.msg,
                    field: err.path
                } as ErrorType
            }

        }) as ErrorType[]
        res.status(HTTPResponseStatusCodes.BAD_REQUEST).json({errorsMessages: resultError});
    }
}