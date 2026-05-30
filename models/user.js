import { string } from "joi";
import mongoose, { Schema, trusted } from "mongoose";
const schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: string,
        required: true,
    }
});

User.plugin(passportLocalMongoose);
export default mongoose.model("User", userSchema);