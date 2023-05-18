import { addMilliseconds } from 'date-fns'
import {devicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";

export type DeviceType = {
    userId: string,
    deviceName: string,
    ip: string,
    issuedAt: Date,
    expirationAt: Date
}

export const securityServices = {
    async createDevice(userId: string, deviceName: string, ip: string, expiration: number) {
        const newDevice: DeviceType = {
            userId,
            deviceName,
            ip,
            issuedAt: new Date(),
            expirationAt: addMilliseconds(new Date(), expiration)
        }

        return await devicesCommandRepository.createDevice(newDevice);


    }
}