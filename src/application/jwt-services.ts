import jwt, {JwtPayload} from "jsonwebtoken";
import {settings} from "../shared/settings";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";

export type JWTSCredentialsType = {
    userId: string
    deviceId: string
    exp: number
    iat: number
}

export const jwtServices = {
    secret: settings.jwt_secret!,
    createAccessToken(userId: string): ResultDTO<{ accessToken: string }> {
        const accessToken = jwt.sign({userId}, this.secret, {expiresIn: "600000"});

        if (accessToken) {
            return new ResultDTO(InternalCode.Success, {accessToken});
        } else {
            return new ResultDTO(InternalCode.Server_Error);
        }
    },
    createRefreshToken(userId: string, deviceId: string): ResultDTO<{ refreshToken: string }> {
        const refreshToken = jwt.sign({userId, deviceId}, this.secret, {expiresIn: "300000"});

        if (refreshToken) {
            return new ResultDTO(InternalCode.Success, {refreshToken});
        } else {
            return new ResultDTO(InternalCode.Server_Error);
        }
    },
    checkCredentials(token: string): ResultDTO<{ id: string }> {
        const result = jwt.verify(token, this.secret!) as JwtPayload;

        if (result) {
            return new ResultDTO(InternalCode.Success, {id: result.userId});
        } else {
            return new ResultDTO(InternalCode.Server_Error);
        }
    },
    decodeToken(token: string): ResultDTO<JWTSCredentialsType> {
        const result = jwt.decode(token, {json: true});

        if (result) {
            const credentials = {
                userId: result.userId,
                exp: result.exp!,
                deviceId: result.deviceId,
                iat: result.iat!
            }

            return new ResultDTO(InternalCode.Success, credentials);
        } else {
            return new ResultDTO(InternalCode.Server_Error);
        }
    }
}
