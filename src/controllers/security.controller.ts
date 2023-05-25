import {Request, Response} from "express";
import {devicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";
import {devicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {RequestWithParams, ResponseEmpty} from "../shared/types";
import {securityServices} from "../domain/security-services";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const getAllDevices = async (req: Request, res: Response) => {
       const activeSessions = await devicesQueryRepository.findDeviceByUserId(req.userId!);

    if (activeSessions && activeSessions.length) {
        res.status(HTTPResponseStatusCodes.OK).json(activeSessions);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const deleteAllDevices = async (req: Request, res: ResponseEmpty) => {
    const isDeleted = await securityServices.deleteAllUserSessions(req.userId!, req.cookies.refreshToken);

    if (isDeleted) {
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const deleteOneDevice = async (req: RequestWithParams<{ deviceId: string }>, res: ResponseEmpty) => {
    const deviceInfo = await devicesQueryRepository.findDeviceById(req.params.deviceId);
    if(!deviceInfo) {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        return;
    }

    if(deviceInfo.userId !== req.userId) {
        res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
        return;
    }

    const isDeleted = await devicesCommandRepository.deleteUserSession(req.params.deviceId)

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
}