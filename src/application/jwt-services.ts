import jwt, {JwtPayload} from "jsonwebtoken";
import {settings} from "../shared/settings";

export type JWTSCredentialsType = {
    userId: string
    deviceId?: string
    exp: number
    iat: number
}

export const jwtServices = {
    secret: settings.jwt_secret!,
    createAccessToken(userId: string): string {
        return jwt.sign({userId}, this.secret, {expiresIn: "10000"});
    },
    createRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign({userId, deviceId}, this.secret, {expiresIn: "20000"});
    },
    checkCredentials(token: string): string | null {
        try {
            const result = jwt.verify(token, this.secret!) as JwtPayload;
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
