import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string | null;
            cookies?: Record<string, string>;
        }
    }
}