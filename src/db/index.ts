import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config()

const url = process.env.MONGO_URL;

if (!url) {
    throw new Error('MongoDB url not found');
}

export const client = new MongoClient(url);

export const runDB = async () => {
    try {
        await client.connect();
        console.log('Connected successfully to server');
    } catch (e) {
        console.log('Don\'t connected successfully to server');
        await client.close();
    }
}