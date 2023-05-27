import mongoose from "mongoose";
import {UsersSchema} from "./users.schema";
import {UsersDB} from "./types";

export const UsersModelClass = mongoose.model<UsersDB>("users", UsersSchema);