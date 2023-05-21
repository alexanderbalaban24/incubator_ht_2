import {deviceSecureCollections} from "../../db/collections/deviceSecureCollections";
import {ObjectId} from "mongodb";
import {DeviceDataType} from "../../domain/auth-services";


export const devicesQueryRepository = {
    async findDeviceById(deviceId: string): Promise<DeviceDataType | null> {
        const device = await deviceSecureCollections.findOne({_id: new ObjectId(deviceId)});

        if (device) {
            return {
                id: device._id.toString(),
                userId: device.userId,
                deviceName: device.deviceName,
                ip: device.ip,
                issuedAt: device.issuedAt,
                expirationAt: device.expirationAt
            }
        } else {
            return null;
        }
    }
}