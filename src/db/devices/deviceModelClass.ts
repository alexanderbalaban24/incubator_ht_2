/*
import {client} from "../run-db";
import {ObjectId, OptionalId} from "mongodb";


export const deviceModel = client.db().collection<OptionalId<DeviceAuthSessionsTypeDB>>("deviceAuthSessions");*/

import mongoose from "mongoose";
import {DeviceAuthSessionsTypeDB} from "./types";
import {DeviceSchema} from "./device.schema";

export const DeviceModelClass = mongoose.model<DeviceAuthSessionsTypeDB>("device", DeviceSchema);
