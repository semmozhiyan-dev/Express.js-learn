import mongoose from "mongoose";

const UserSchema =new mongoose.Schema({
    user_name:{
        type:mongoose.Schema.Types.String,
        required:true,
        unnique:true,
    },
    password:{
        type:mongoose.Schema.Types.String,
        
    },
    age:{
        type:mongoose.Schema.Types.Number,
        required:false,
    },
    googleId:{
        type:mongoose.Schema.Types.String,
        unique:true,
        sparse:true, // allows multiple documents to have null googleId
    },
    email:{
        type:mongoose.Schema.Types.String,
        unique:true,
        sparse:true, // allows multiple documents to have null email
    }


});
export const User = mongoose.model("User",UserSchema);