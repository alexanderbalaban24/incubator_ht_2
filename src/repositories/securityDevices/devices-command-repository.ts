import {deviceSecureCollections} from "../../db/collections/deviceSecureCollections";
import {DeviceType} from "../../domain/security-services";


export const devicesCommandRepository = {
    async createDevice(newDevice: DeviceType): Promise<string> {
        const result = await deviceSecureCollections.insertOne(newDevice);

        return result.insertedId.toString();
    }
}