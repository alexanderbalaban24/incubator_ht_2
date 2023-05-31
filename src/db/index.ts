import mongoose from "mongoose";
import {settings} from "../shared/settings";

if (!settings.mongo_url) {
    throw new Error('MongoDB url not found');
}

const mongoURL = settings.mongo_url;


export const startDB = async () => {
    try {
        await mongoose.connect(mongoURL, {
            dbName: "blog-platform"
        });
        console.log('Connected successfully to server');
    } catch (e) {
        console.log('Don\'t connected successfully to server');
        await mongoose.disconnect();
    }
}