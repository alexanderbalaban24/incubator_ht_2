import {config} from "dotenv";
import {app} from "./app";
import {runDB} from "./db";
config();

const PORT = process.env.PORT;

const startApp = async () => {
    try {
        await runDB();
        app.listen(PORT, () => {
            console.log(`Server running on port : ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();