import {ObjectId} from "mongodb";
import {DeviceModelClass} from "../../models/database/DeviceModelClass";
import {DeviceDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {injectable} from "inversify";

@injectable()
export class DevicesCommandRepository {
    async createDevice(newDevice: DeviceDTO): Promise<ResultDTO<{ id: string }>> {
        const result = await new DeviceModelClass(newDevice).save();
        if (!result) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Success, {id: result._id.toString()});
    }

    async updateIssuedAt(deviceId: string, issuedAt: Date): Promise<ResultDTO<{ isUpdated: boolean }>> {
        const deviceInstances = await DeviceModelClass.findById(deviceId);
        if (!deviceInstances) return new ResultDTO(InternalCode.Not_Found);

        deviceInstances.issuedAt = issuedAt;

            await deviceInstances.save();

            return new ResultDTO(InternalCode.Success, { isUpdated: true });
    }

    async deleteAllUserSessions(userId: string, exclude?: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const result = await DeviceModelClass.deleteMany({userId, _id: {$ne: new ObjectId(exclude)}});

        if (result.deletedCount > 0) {
            return new ResultDTO(InternalCode.Success, {isDeleted: true});
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }

    async deleteUserSession(deviceId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const deviceInstances = await DeviceModelClass.findById(deviceId);
        if (!deviceInstances) return new ResultDTO(InternalCode.Not_Found);


        const result = await deviceInstances.deleteOne();
        const isDeleted = result.$isDeleted();

        if (!isDeleted) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Success, {isDeleted: true});
    }
}