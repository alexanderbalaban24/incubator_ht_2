import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type DeviceAuthSessionsType = {
    _id: ObjectId,
    userId: string,
    ip: string,
    deviceName: string,
    issuedAt: Date,
    expirationAt: Date
}


export const deviceSecureCollections = client.db().collection<OptionalId<DeviceAuthSessionsType>>("deviceAuthSessions");