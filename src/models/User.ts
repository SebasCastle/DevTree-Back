import { link } from "fs";
import mongoose, { Schema, Document } from "mongoose";

export interface InterUser extends Document{
    handle: string;
    name: string;
    mail:string;
    password: string;
    description: string;
    image: string;
    links: string;
}

const userSchema = new Schema({
    handle:{
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    name:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    description:{
        type:String,
        default:'',
    },
    image:{
        type:String,
        default:'',
    },
    links:{
        type:String,
        default: '[]'
    }
})

const User = mongoose.model<InterUser>('User', userSchema);
export default User