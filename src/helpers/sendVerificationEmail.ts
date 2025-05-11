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
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message | Verification code',
            react: VerificationEmail({username, verifyCode}),
        });

        if (error) {
            return {
                success: false,
                message: "Failed to send verifiation email"
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
            message: "Failed to send verifiation email"
        }
    }
}