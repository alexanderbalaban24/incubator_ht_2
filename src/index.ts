import {app} from "./app";
import {settings} from "./shared/settings";
import {runDB} from "./db";

const PORT = settings.port;

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