require("dotenv").config();
const app = require("./app");
const connectDb = require("./db/db");

connectDb();

app.listen(3000, () => {
    console.log("Server started on port 3000");
});