import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{

    try{
        const { data, error } = await resend.emails.send({
            from: 'no-reply@codewithlokesh.com',
            to: email,
            subject: 'True Whisper message | Verification code',
            react: VerificationEmail({username, verifyCode}),
        });

        // console.log("resend error: ", error);
        if (error) {
            return {
                success: false,
                message: "Failed to send verification email"
            }
        }

        return {
            success: true,
            message: "Verifiation mail sent successfully"
        }
    }
    catch(emailError){
        console.error("Error sending verification Email", emailError);
        return {
            success: false,
            message: "Internal server error, Resend"
        }
    }
}