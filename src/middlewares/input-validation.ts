import {validationResult} from "express-validator";
import {ErrorType, RequestEmpty, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";

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
        res.status(400).json({errorsMessages: resultError});
    }
}