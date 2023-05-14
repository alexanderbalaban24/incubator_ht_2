import jwt from "jsonwebtoken";
import {ViewLoginModel} from "../models/auth/ViewLoginModel";


export const jwtServices = {
    createJWT(userId: string): ViewLoginModel {
        const accessToken = jwt.sign({userId}, process.env.JWT_SECRET!);
        return {accessToken};
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
