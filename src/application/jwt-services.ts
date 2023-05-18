import jwt from "jsonwebtoken";


export const jwtServices = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: "10000"});
    },
    createRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign({userId, deviceId}, process.env.JWT_SECRET!, {expiresIn: "20000"});
    },
    checkCredentials(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!);
            return {userId: result.userId, exp: result.exp, deviceId: result?.deviceId, iat: result.iat};
        } catch(e){
            return null;
        }
    }
}
