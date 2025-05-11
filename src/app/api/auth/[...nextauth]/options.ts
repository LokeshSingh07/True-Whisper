import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any>{
                await dbConnect();
                
                // console.log("credentails: ", credentials)

                // @ts-ignore
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Please provide both email and password.");
                }
                
                try{
                    // console.log("Credentials : ", credentials);
                    const user = await UserModel.findOne({
                        $or: [
                            // @ts-ignore
                            {email: credentials?.identifier},
                            // @ts-ignore
                            {username: credentials?.identifier},
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this email or username.")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account first before logging in.")
                    }
                    
                    const isPasswordCorrect = await bcrypt.compare(credentials?.password, user.password);

                    if(!isPasswordCorrect){
                        throw new Error("Invalid credentials")
                    }
                    else{
                        return user;
                    }
                }
                catch(err: any){
                    throw new Error(err)
                }
            }
        })        
    ],
    pages:{
        signIn: "/signin",
        signOut: "/signout"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) { 
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }

            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
        
            return session
        }
    }
}