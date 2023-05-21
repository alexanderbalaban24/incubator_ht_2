import jwt, {JwtPayload} from "jsonwebtoken";

export type JWTSCredentialsType = {
    userId: string
    deviceId?: string
    exp: Date
    iat: Date
}

export const jwtServices = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: "10000"});
    },
    createRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign({userId, deviceId}, process.env.JWT_SECRET!, {expiresIn: "20000"});
    },
    checkCredentials(token: string): JWTSCredentialsType | null {
        try {
            const result = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            return {userId: result.userId, exp: new Date(result.exp!), deviceId: result?.deviceId, iat: new Date(result.iat!)};
        } catch(e){
            return null;
        }
    }
}
