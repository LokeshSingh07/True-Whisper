import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"



export async function POST(req: Request){
    await dbConnect();
    try{
        const {username, code} = await req.json();
        const decodededUsername = decodeURIComponent(username)
        
        const user = await UserModel.findOne({
            username: decodededUsername,
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        // code invalid, expiry
        const isCodeValid = user.verfiyCode === code
        const isCodeNotExpired = new Date(user.verfiyCodeExpiry) > new Date()
        
        if(!isCodeValid){  
            return Response.json({
                success: false,
                message: "Invalid code"
            },{status: 400})
        }

        if(!isCodeNotExpired){  
            return Response.json({
                success: false,
                message: "verification code hass expired, Please signup again to get a new code"
            },{status: 400})
        }

        // if correct verifyCode
        user.isVerified = true
        await user.save();
        
        return Response.json({
            success: true,
            message: "Account verified successfully"
        },{status: 200})
    }
    catch(err){
        console.error("Error while verifying the code", err);
        return Response.json({
            success: false,
            message: "Error while verifying the code"
        },{status: 500})
    }
}