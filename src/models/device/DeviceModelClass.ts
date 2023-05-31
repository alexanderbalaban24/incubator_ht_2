import mongoose from "mongoose";
import {WithId} from "mongodb";

export type DeviceAuthSessionsTypeDB = {
    userId: string,
    ip: string,
    deviceName: string,
    issuedAt: Date,
    expirationAt: Date
}

export const DeviceSchema = new mongoose.Schema<DeviceAuthSessionsTypeDB>({
    userId: {type: String, required: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    issuedAt: {type: Date, required: true},
    expirationAt: {type: Date, required: true}
});

export const DeviceModelClass = mongoose.model<DeviceAuthSessionsTypeDB>("device", DeviceSchema);
