import mongoose from "mongoose";

const UserSchema =new mongoose.Schema({
    user_name:{
        type:mongoose.Schema.Types.String,
        required:true,
        unnique:true,
    },
    password:{
        type:mongoose.Schema.Types.String,
        required:true,
    },
    age:{
        type:mongoose.Schema.Types.Number,
        required:true,
    }


});
export const User = mongoose.model("User",UserSchema);