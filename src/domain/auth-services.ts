import {authQueryRepository} from "../repositories/auth/auth-query-repository";
import {compare} from "bcrypt";
import {usersServices} from "./users-services";
import {businessService} from "./business-service";
import {authCommandRepository} from "../repositories/auth/auth-command-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {jwtServices} from "../application/jwt-services";
import {securityServices} from "./security-services";
import {devicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";

export type ConfirmationDataType = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}

export type UserInfoType = {
    id: string,
    passwordHash: string
}

export type LockedTokenType = {
    refreshToken: string
}

export type TokenPair = {
    accessToken: string,
    refreshToken: string
}

export type DeviceDataType = {
    id: string,
    userId: string,
    deviceName: string,
    ip: string,
    issuedAt: Date,
    expirationAt: Date
}


export const authServices = {
    async login(loginOrEmail: string, password: string, deviceName: string = "Other device", ip: string): Promise<TokenPair | null> {
        const userInfo = await authQueryRepository.searchUserByCredentials(loginOrEmail);

        if (userInfo) {
            const isValidCredentials = await compare(password, userInfo.passwordHash);

            if (isValidCredentials) {
                const accessToken = jwtServices.createAccessToken(userInfo.id);

                const refreshToken = await securityServices.createDevice(userInfo.id, deviceName, ip, 20000);

                return {accessToken, refreshToken}
            } else {
                return null;
            }
        } else {
            return null;
        }

    },
    async refreshToken(token: string, userId: string): Promise<TokenPair | null> {
        const refreshInfo = await jwtServices.decodeToken(token);
        if (!refreshInfo || !refreshInfo.deviceId) return null;

        const deviceInfo = await devicesQueryRepository.findDeviceById(refreshInfo.deviceId);
        if(!deviceInfo) return null;

        if(deviceInfo.userId === refreshInfo.userId && refreshInfo.iat === Math.trunc(+deviceInfo.issuedAt / 1000)) {
            await securityServices.updateSessionTime(deviceInfo.id);

            const accessToken = jwtServices.createAccessToken(userId);
            const refreshToken = jwtServices.createRefreshToken(userId, deviceInfo.id);

            return {accessToken, refreshToken};
        } else {
            return null;
        }
    },
    async revokeRefreshToken(refreshToken: string): Promise<boolean> {
        const refreshInfo = await jwtServices.decodeToken(refreshToken);
        if(!refreshInfo || !refreshInfo.deviceId) return false;

        const deviceInfo = await devicesQueryRepository.findDeviceById(refreshInfo.deviceId);
        if(!deviceInfo) return false;

        if(deviceInfo.userId === refreshInfo.userId && refreshInfo.iat === Math.trunc(+deviceInfo.issuedAt / 1000)) {
            return await securityServices.revokeRefreshToken(refreshInfo.userId);
        } else {
            return false;
        }

    },
    async registration(login: string, email: string, password: string): Promise<boolean> {
        const userId = await usersServices.createUser(login, email, password, false);
        if (!userId) return false;

        const confirmationData = await authQueryRepository.findUserWithConfirmationDataById(userId);
        if (!confirmationData) return false;

        const success = await businessService.doOperation(email, confirmationData.confirmationCode);

        if (success) {
            return true;
        } else {
            await usersServices.deleteUserById(userId);
            return false;
        }
    },
    async verifyEmail(code: string): Promise<boolean> {
        const userId = await authQueryRepository.findUserByConfirmationCode(code);

        if (userId) {
            return await authCommandRepository.updateIsConfirmedFieldById(userId);
        } else {
            return false;
        }
    },
    async resendConfirmationCode(email: string): Promise<boolean> {
        const confirmationCode = uuidv4();
        const expirationDate = add(new Date(), {hours: 3}).toISOString();

        const isUpdate = await authCommandRepository.updateConfirmationDataByEmail(email, confirmationCode, expirationDate);
        if (!isUpdate) return false;

        return await businessService.doOperation(email, confirmationCode);
    }
}