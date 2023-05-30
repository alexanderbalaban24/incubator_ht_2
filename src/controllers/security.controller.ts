import {Request, Response} from "express";
import {RequestWithParams, ResponseEmpty} from "../shared/types";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {SecurityServices} from "../domain/security-services";
import {DevicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {DevicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";

export class SecurityController {

    constructor(
        protected securityServices: SecurityServices,
        protected devicesCommandRepository: DevicesCommandRepository,
        protected devicesQueryRepository: DevicesQueryRepository
    ){}

    async getAllDevices(req: Request, res: Response)  {
        const activeSessions = await this.devicesQueryRepository.findDeviceByUserId(req.userId!);

        if (activeSessions && activeSessions.length) {
            res.status(HTTPResponseStatusCodes.OK).json(activeSessions);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async deleteAllDevices(req: Request, res: ResponseEmpty)  {
        const isDeleted = await this.securityServices.deleteAllUserSessions(req.userId!, req.cookies.refreshToken);

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async deleteOneDevice(req: RequestWithParams<{ deviceId: string }>, res: ResponseEmpty)  {
        const deviceInfo = await this.devicesQueryRepository.findDeviceById(req.params.deviceId);
        if(!deviceInfo) {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
            return;
        }

        if(deviceInfo.userId !== req.userId) {
            res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
            return;
        }

        const isDeleted = await this.devicesCommandRepository.deleteUserSession(req.params.deviceId)

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }
}