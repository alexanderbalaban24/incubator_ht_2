import {compare, genSalt, hash} from "bcrypt";
import {businessService} from "./business-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {jwtServices} from "../application/jwt-services";
import {EmailEvents} from "../shared/enums";
import {usersServices} from "../composition-root";
import {AuthQueryRepository} from "../repositories/auth/auth-query-repository";
import {AuthCommandRepository} from "../repositories/auth/auth-command-repository";
import {SecurityServices} from "./security-services";
import {DevicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";
import {RecoveryPasswordDTO, TokenPairDTO} from "./dtos";


export class AuthServices {

    constructor(
        protected authQueryRepository: AuthQueryRepository,
        protected authCommandRepository: AuthCommandRepository,
        protected securityServices: SecurityServices,
        protected devicesQueryRepository: DevicesQueryRepository
    ){}

    async login(loginOrEmail: string, password: string, deviceName: string = "Other device", ip: string): Promise<TokenPairDTO | null> {
        const userInfo = await this.authQueryRepository.searchUserByCredentials(loginOrEmail);

        if (userInfo) {
            const isValidCredentials = await compare(password, userInfo.passwordHash);

            if (isValidCredentials) {
                const accessToken = jwtServices.createAccessToken(userInfo.id);

                const refreshToken = await this.securityServices.createDevice(userInfo.id, deviceName, ip, 20000);

                return {accessToken, refreshToken}
            } else {
                return null;
            }
        } else {
            return null;
        }

    }
    async refreshToken(token: string, userId: string): Promise<TokenPairDTO | null> {
        const refreshInfo = await jwtServices.decodeToken(token);
        if (!refreshInfo || !refreshInfo.deviceId) return null;

        const deviceInfo = await this.devicesQueryRepository.findDeviceById(refreshInfo.deviceId);
        if(!deviceInfo) return null;

        if(deviceInfo.userId === refreshInfo.userId && refreshInfo.iat === Math.trunc(+deviceInfo.issuedAt / 1000)) {
            await this.securityServices.updateSessionTime(deviceInfo.id);

            const accessToken = jwtServices.createAccessToken(userId);
            const refreshToken = jwtServices.createRefreshToken(userId, deviceInfo.id);

            return new TokenPairDTO(accessToken, refreshToken);
        } else {
            return null;
        }
    }
    async logout(refreshToken: string): Promise<boolean> {
        const refreshInfo = await jwtServices.decodeToken(refreshToken);
        if(!refreshInfo || !refreshInfo.deviceId) return false;

        const deviceInfo = await this.devicesQueryRepository.findDeviceById(refreshInfo.deviceId);
        if(!deviceInfo) return false;

        if(deviceInfo.userId === refreshInfo.userId && refreshInfo.iat === Math.trunc(+deviceInfo.issuedAt / 1000)) {
            return await this.securityServices.revokeRefreshToken(refreshInfo.deviceId);
        } else {
            return false;
        }

    }
    async registration(login: string, email: string, password: string): Promise<boolean> {
        const userId = await usersServices.createUser(login, email, password, false);
        if (!userId) return false;

        const confirmationData = await this.authQueryRepository.findUserWithEmailConfirmationDataById(userId);
        if (!confirmationData) return false;

        const success = await businessService.doOperation(EmailEvents.Registration, email, confirmationData.confirmationCode);

        if (success) {
            return true;
        } else {
            await usersServices.deleteUserById(userId);
            return false;
        }
    }
    async recoverPass(email: string): Promise<boolean> {
        const userInfo = await this.authQueryRepository.searchUserByCredentials(email);
        if (!userInfo) return false;

        const recoverPasswordData = new RecoveryPasswordDTO();

        const recoverCode = await this.authCommandRepository.updateRecoveryData(userInfo.id, recoverPasswordData);
        if (!recoverCode) return false;


        return await businessService.doOperation(EmailEvents.Recover_password, email, recoverCode);

    }
    async confirmRecoverPass(newPassword: string, code: string): Promise<boolean> {
        const userId = await this.authQueryRepository.findUserByConfirmationCode(code);

        const passwordSalt = await genSalt(10);
        const passwordHash = await hash(newPassword, passwordSalt);

        if (userId) {
            return await this.authCommandRepository.updateIsConfirmedPasswordConfirmationAndPasswordHashById(userId, passwordHash);
        } else {
            return false;
        }
    }
    async verifyEmail(code: string): Promise<boolean> {
        const userId = await this.authQueryRepository.findUserByConfirmationCode(code);

        if (userId) {
            return await this.authCommandRepository.updateIsConfirmedEmailConfirmationFieldById(userId);
        } else {
            return false;
        }
    }
    async resendConfirmationCode(email: string): Promise<boolean> {
        const confirmationCode = uuidv4();
        const expirationDate = add(new Date(), {hours: 3});

        const isUpdate = await this.authCommandRepository.updateConfirmationDataByEmail(email, confirmationCode, expirationDate);
        if (!isUpdate) return false;

        return await businessService.doOperation(EmailEvents.Registration, email, confirmationCode);
    }
}