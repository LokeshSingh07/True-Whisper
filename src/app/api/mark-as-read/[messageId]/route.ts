import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";




export async function PATCH(req:Request, {params}: {params: Promise<{messageId: string}>}){
    const {messageId} = await params;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    // Validate messageId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return Response.json({ 
            success: false, 
            message: "Invalid message ID" 
        },{status: 400});
    }

    try{
        const isRead = await UserModel.updateOne(
            {_id: user._id, "messages._id": messageId},
            {$set: {"messages.$.read": true}}
        )

        console.log("isread: ", isRead);

        if (isRead.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Failed to mark message as read"
            },{status: 400})
        }


        return Response.json({
            success: true,
            message: "Message mark as read successfully"
        }, {status: 200})

    }
    catch(err){
        console.log("Error in marking message as read route ", err)
        return Response.json({
            success: false,
            message: "Error while deleting message",
        },{status: 500})
    }
}




