import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/components";
import { getMailer } from "@/lib/nodemailer";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    const mailer = getMailer();

    if (!mailer.ok) {
        return {
            success: false,
            message: mailer.error,
        };
    }

    try {
        const html = await render(VerificationEmail({ email, verifyCode }));

        await mailer.transporter.sendMail({
            from: mailer.from,
            to: email,
            subject: "True Whisper message | Verification code",
            html,
            text: `Hi ${username}, your verification code is: ${verifyCode}`,
        });

        return {
            success: true,
            message: "Verification mail sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending verification Email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}