import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            cookies?: Record<string, string>;
        }
    }
}