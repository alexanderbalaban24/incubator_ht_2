import jwt from "jsonwebtoken";


export const jwtServices = {
    createJWT(userId: string) {
        return jwt.sign({userId}, process.env.JWT_SECRET!);
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
