import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";



export async function POST(req: Request){
    await dbConnect();

    const {username, content} = await req.json();
    try{
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            },{status: 404})
        }

        // is user accpting the  messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            },{status: 401})
        }

        const newMessage = {
            content,
            createdAt: new Date(),
            read: false,
            starred: false,
        }
        // console.log("new msg : ", newMessage);

        user.messages.push(newMessage as Message);
        await user.save();

        // console.log(user)

        return Response.json({
            success: true,
            message: "Mesage sent successfully"
        },{status: 201})
    }
    catch(err){
        console.log("Error in sending messages");
        return Response.json({
            success: false,
            message: "Internal server error"
        },{status: 500})
    }
}
