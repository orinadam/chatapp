const mongoose = require('mongoose');
module.exports = class Db {
    constructor() {
        const dbUrl = 'mongodb+srv://ori_nadam:ori160304@cluster0.hiuum.mongodb.net/chatapp?retryWrites=true&w=majority';
        mongoose.connect(dbUrl, {
            useNewUrlParser: true,

        });
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", () => {
            console.log("Database connected");
        });
    }

}