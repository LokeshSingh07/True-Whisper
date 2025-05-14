import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document{
    content: string;
    createdAt: Date;
    read: boolean;
    starred: boolean;
}
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    starred: {
        type: Boolean,
        default: false,
    },
})





export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verfiyCode: string,
    verfiyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[],
}
const UserScehma: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'please use a valid address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],   
    },  
    verfiyCode: {
        type: String,
        required: [true, 'verify code is required'],   
    },
    verfiyCodeExpiry: {
        type: Date,
        required: [true, 'verify code expiry is required'],   
    },
    isVerified: {
        type: Boolean,
        required: false, 
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],

},{timestamps: true})




// Next.js edge pr run krta h -> means application first time bootup ho rahi h ya phle bhi ho rakhi h
// phle se bana hua ho || nhi ho ==> or laga kr check krte h 
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserScehma);

export default UserModel