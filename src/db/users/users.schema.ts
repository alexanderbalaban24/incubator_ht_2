import mongoose from "mongoose";
import {WithId} from "mongodb";
import {UsersDB} from "./types";

export const UsersSchema = new mongoose.Schema<WithId<UsersDB>>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true}
    },
    passwordRecover: {
        confirmationCode: {type: String, required: true, default: "asd"},
        expirationDate: {type: Date, required: true, default: Date.now},
        isConfirmed: {type: Boolean, required: true, default: false}
    }
}, {timestamps: true});