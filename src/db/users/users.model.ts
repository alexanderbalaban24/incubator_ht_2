import mongoose from "mongoose";
import {UsersSchema} from "./users.schema";
import {UsersDB} from "./types";

export const UsersModel = mongoose.model<UsersDB>("users", UsersSchema);