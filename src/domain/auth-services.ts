import {compare, genSalt, hash} from "bcrypt";
import {businessService} from "./business-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {jwtServices} from "../application/jwt-services";
import {EmailEvents, InternalCode} from "../shared/enums";
import {usersServices} from "../composition-root";
import {AuthQueryRepository} from "../repositories/auth/auth-query-repository";
import {AuthCommandRepository} from "../repositories/auth/auth-command-repository";
import {SecurityServices} from "./security-services";
import {DevicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";
import {RecoveryPasswordDTO, TokenPairDTO} from "./dtos";
import {ResultDTO} from "../shared/dto";


export class AuthServices {

    constructor(
        protected authQueryRepository: AuthQueryRepository,
        protected authCommandRepository: AuthCommandRepository,
        protected securityServices: SecurityServices,
        protected devicesQueryRepository: DevicesQueryRepository
    ) {
    }

    async login(loginOrEmail: string, password: string, deviceName: string = "Other device", ip: string): Promise<ResultDTO<TokenPairDTO>> {
        const userInfoResult = await this.authQueryRepository.searchUserByCredentials(loginOrEmail);
        if (!userInfoResult.success) return new ResultDTO(userInfoResult.code);

        const isValidCredentials = await compare(password, userInfoResult.payload!.passwordHash);
        if (!isValidCredentials) return new ResultDTO(InternalCode.Unathorized);

        const accessTokenResult = jwtServices.createAccessToken(userInfoResult.payload!.id);
        const refreshTokenResult = await this.securityServices.createDevice(userInfoResult.payload!.id, deviceName, ip, 20000);
        if (!refreshTokenResult.success || !accessTokenResult.success) return new ResultDTO(InternalCode.Server_Error);

        const pair = new TokenPairDTO(accessTokenResult.payload!.accessToken, refreshTokenResult.payload!.refreshToken)

        return new ResultDTO(InternalCode.Success, pair);
    }

    async refreshToken(token: string, userId: string): Promise<ResultDTO<TokenPairDTO>> {
        const refreshInfoResult = await jwtServices.decodeToken(token);
        if (!refreshInfoResult.success) return new ResultDTO(InternalCode.Unathorized);

        const deviceInfoResult = await this.devicesQueryRepository.findDeviceById(refreshInfoResult.payload!.deviceId);
        if (!deviceInfoResult.success) return new ResultDTO(InternalCode.Not_Found);

        if (deviceInfoResult.payload!.userId === refreshInfoResult.payload!.userId && refreshInfoResult.payload!.iat === Math.trunc(+deviceInfoResult.payload!.issuedAt / 1000)) {
            await this.securityServices.updateSessionTime(deviceInfoResult.payload!.id);

            const accessTokenResult = jwtServices.createAccessToken(userId);
            const refreshTokenResult = jwtServices.createRefreshToken(userId, deviceInfoResult.payload!.id);
            if (!refreshTokenResult.success || !accessTokenResult.success) return new ResultDTO(InternalCode.Server_Error);

            const pair = new TokenPairDTO(accessTokenResult.payload!.accessToken, refreshTokenResult.payload!.refreshToken);
            return new ResultDTO(InternalCode.Success, pair);
        } else {
            return new ResultDTO(InternalCode.Unathorized);
        }
    }

    async logout(refreshToken: string): Promise<ResultDTO<{ loggedOut: boolean }>> {
        const refreshInfoResult = await jwtServices.decodeToken(refreshToken);
        if (!refreshInfoResult.success || !refreshInfoResult.payload!.deviceId) return new ResultDTO(InternalCode.Unathorized);

        const deviceInfoResult = await this.devicesQueryRepository.findDeviceById(refreshInfoResult.payload!.deviceId);
        if (!deviceInfoResult.success) return new ResultDTO(InternalCode.Unathorized);

        if (deviceInfoResult.payload!.userId === refreshInfoResult.payload!.userId && refreshInfoResult.payload!.iat === Math.trunc(+deviceInfoResult.payload!.issuedAt / 1000)) {
            const loggedOutResult = await this.securityServices.revokeRefreshToken(refreshInfoResult.payload!.deviceId);
            if (!loggedOutResult.success) return new ResultDTO(InternalCode.Unathorized);

            return new ResultDTO(InternalCode.No_Content, {loggedOut: loggedOutResult.payload!.isRevoked});
        } else {
            return new ResultDTO(InternalCode.Unathorized);
        }

    }

    async registration(login: string, email: string, password: string): Promise<ResultDTO<{ isRegistered: boolean }>> {
        const userResult = await usersServices.createUser(login, email, password, false);
        if (!userResult.success) return new ResultDTO(InternalCode.Server_Error);

        const confirmationResult = await this.authQueryRepository.findUserWithEmailConfirmationDataById(userResult.payload!.id);
        if (!confirmationResult.success) return new ResultDTO(confirmationResult.code);

        const sendingResult = await businessService.doOperation(EmailEvents.Registration, email, confirmationResult.payload!.confirmationCode);

        if (sendingResult.success) {
            return new ResultDTO(InternalCode.No_Content, {isRegistered: true});
        } else {
            await usersServices.deleteUserById(userResult.payload!.id);
            return new ResultDTO(InternalCode.Server_Error);
        }
    }

    async recoverPass(email: string): Promise<ResultDTO<{ isRecovered: boolean }>> {
        const userInfoResult = await this.authQueryRepository.searchUserByCredentials(email);
        if (!userInfoResult.success) return new ResultDTO(InternalCode.No_Content);

        const recoverPasswordData = new RecoveryPasswordDTO();

        const recoverCodeResult = await this.authCommandRepository.updateRecoveryData(userInfoResult.payload!.id, recoverPasswordData);
        if (!recoverCodeResult.success) return new ResultDTO(recoverCodeResult.code);


        const sendingResult = await businessService.doOperation(EmailEvents.Recover_password, email, recoverCodeResult.payload!.confirmationCode);
        if (!sendingResult.success) return new ResultDTO(sendingResult.code);

        return new ResultDTO(InternalCode.No_Content, {isRecovered: true});
    }

    async confirmRecoverPass(newPassword: string, code: string): Promise<ResultDTO<{ isConfirmed: boolean }>> {
        const userResult = await this.authQueryRepository.findUserByConfirmationCode(code);

        const passwordSalt = await genSalt(10);
        const passwordHash = await hash(newPassword, passwordSalt);

        if (userResult.success) {
            const updatedResult = await this.authCommandRepository.updateIsConfirmedPasswordConfirmationAndPasswordHashById(userResult.payload!.id, passwordHash);
            if (!updatedResult.success) return new ResultDTO(InternalCode.Not_Found);

            return new ResultDTO(InternalCode.No_Content, {isConfirmed: true});
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }

    async verifyEmail(code: string): Promise<ResultDTO<{ isVerify: boolean }>> {
        const userResult = await this.authQueryRepository.findUserByConfirmationCode(code);
        if (!userResult.success) return new ResultDTO(InternalCode.Not_Found);

        const updateResult = await this.authCommandRepository.updateIsConfirmedEmailConfirmationFieldById(userResult.payload!.id);
        if (!updateResult.success) return new ResultDTO(InternalCode.Not_Found);

        return new ResultDTO(InternalCode.No_Content, {isVerify: true});
    }

    async resendConfirmationCode(email: string): Promise<ResultDTO<{ isResending: boolean }>> {
        const confirmationCode = uuidv4();
        const expirationDate = add(new Date(), {hours: 3});

        const updateResult = await this.authCommandRepository.updateConfirmationDataByEmail(email, confirmationCode, expirationDate);
        if (!updateResult.success) return new ResultDTO(InternalCode.Not_Found);

        const sendingResult = await businessService.doOperation(EmailEvents.Registration, email, confirmationCode);
        if (!sendingResult.success) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.No_Content, { isResending: true });
    }
}