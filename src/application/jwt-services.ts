import jwt, {JwtPayload} from "jsonwebtoken";

export type JWTSCredentialsType = {
    userId: string
    deviceId?: string
    exp: number
    iat: number
}

export const jwtServices = {
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: "10000"});
    },
    createRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign({userId, deviceId}, process.env.JWT_SECRET!, {expiresIn: "20000"});
    },
    checkCredentials(token: string): string | null {
        try {
            const result = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            return result.userId;
        } catch (e) {
            return null;
        }
    },
    decodeToken(token: string): JWTSCredentialsType | null {
        try {
            const result = jwt.decode(token, {json: true});

            if (result) {
                return {
                    userId: result.userId,
                    exp: result.exp!,
                    deviceId: result?.deviceId,
                    iat: result.iat!
                };
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}
