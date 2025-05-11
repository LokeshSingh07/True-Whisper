import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";



export async function POST(req:Request){
    try{
        await dbConnect();
        const {username, email, password} = await req.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username.toLowerCase(),
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        

        const verifyCode = Math.floor(100000 + Math.random()* 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {status: 500})
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);

                const updatedUser = await UserModel.findOneAndUpdate(
                    {email: email.toLowerCase(),},
                    {
                        $set: {
                            password: hashedPassword,
                            verifyCode,
                            verfiyCodeExpiry: new Date(Date.now() + 3600000),
                        }
                    },
                    {new: true}
                )
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                verfiyCode: verifyCode,
                verfiyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],    
            })

            await newUser.save();
        }

        
        // TODO : add domain to resend 
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email, username, verifyCode
        )

        // console.log("Email response : ", emailResponse);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 400})
        }
        


        return Response.json({
            success: true,
            message: "user registered successfully. Please verify your email"
        },{status: 200})
    }
    catch(err){
        // console.error("Error registering user", err);
        return Response.json({
            success: false,
            message: "Error registering user"
        },{status: 500})
    }
}