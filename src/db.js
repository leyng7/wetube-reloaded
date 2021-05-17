import mongoose from "mongoose";

mongoose.connect("mongodb://192.168.0.15:27017/wetube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;

const handleError = (error) => console.log("DB Error", error);
const handleOpen = () => console.log("Connected to DB");

db.on("error", handleError);
db.once("open", handleOpen);
