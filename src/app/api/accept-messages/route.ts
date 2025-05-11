import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'


export async function POST(req:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 401})
    }

    const userId = user._id;
    const {acceptMessages} = await req.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: ""
            },{status: 401})
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        },{status: 201})
    }
    catch(err){
        // console.log("Failed to updated user status to accppt messages");
        return Response.json({
            success: false,
            message: "Internal server error"
        },{status: 500})
    }
}


export async function GET(req: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 401})
    }

    const userId = user._id;
    
    try{
        const foundUser = await UserModel.findById(userId);
        
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }
        
        
        return Response.json({
            success: true,
            message: "user found",
            isAcceptingMessage: foundUser.isAcceptingMessage
        },{status: 200})
    }
    catch(err){
        // console.log("Error in getting message accptance status ", err)
        return Response.json({
            success: false,
            message: "Internal server error",
        },{status: 500})
    }
}