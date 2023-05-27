import mongoose from "mongoose";
import {WithId} from "mongodb";
import {DeviceAuthSessionsTypeDB} from "./types";

export const DeviceSchema = new mongoose.Schema<WithId<DeviceAuthSessionsTypeDB>>({
    userId: {type: String, required: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    issuedAt: {type: Date, required: true},
    expirationAt: {type: Date, required: true}
});