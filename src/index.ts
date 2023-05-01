import {config} from "dotenv";
import {app} from "./app";
config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});