import express from "express";
import mongoose from "mongoose";

const app = express();

main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/",  (req, res) => {
    res.send("i love you sangita");
});

app.listen("3000", () => {
    console.log("Server is running");
});