import {z} from "zod"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { usernameValidation } from "@/schemas/signupSchema";




const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(req: Request){
    await dbConnect();
    // localhost:3000/api/cuu?username=""
    try{
        const {searchParams} = new URL(req.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log("zod result : ", result);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError.length>0 ? usernameError.join(', '): "invalid query parameters"
            },{status: 400})
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
    
        // console.log("existingVerifiedUser: ", existingVerifiedUser);
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "User name is already taken"
            },{status: 400})
        }
        
        return Response.json({
            success: true,
            message: "username is available"
        },{status: 200})


    }
    catch(err){
        // console.error("Error checking username", err);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
    }
}