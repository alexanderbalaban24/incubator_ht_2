import jwt from "jsonwebtoken";
import {ViewLoginModel} from "../models/auth/ViewLoginModel";


export const jwtServices = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: "10000"});
    },
    createRefreshToken(userId: string): string {
        return jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: "20000"});
    },
    checkCredentials(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!);
            return result.userId;
        } catch(e){
            return null;
        }
    }
}
