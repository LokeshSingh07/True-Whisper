'use client'
import { z } from "zod";
import { useParams, useRouter } from "next/navigation"
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import axios from "axios";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"






export default function VerifyAccount(){
  const router = useRouter();
  const params = useParams();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // zod implementation
  const register = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  })
  
  const code = register.watch("code");

  const handleResendCode = async()=>{
    if(countdown > 0) return;
    try{
      // TODO: Resend-code-api

      toast.success("Code resent successfully!");
      setCountdown(30);
      const interval = setInterval(()=>{
        setCountdown(prev => {
          if(prev == 1){
            clearInterval(interval);
            return 0;
          }
          return prev-1;
        })
      }, 1000)

    }
    catch(err){
      console.error("Error resending code:", err);
      toast("Failed to resend code.");
    }
  }


  const onSubmit = async(data: z.infer<typeof verifySchema>)=>{
    setIsVerifying(true);
    try{
      console.log("data : ", data);
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
      });

      toast(response.data.message || "success")
      router.replace(`/signin`)
    }
    catch(err){
      console.log("Error in signup of user ", err)
      // err?.response?.data?.message 
      const errorMessage = "Signup failed";
      toast(errorMessage)
    }
    finally{
      setIsVerifying(false)
    }
  } 

 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#151619] p-4">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg rounded-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShieldCheck className="h-8 w-8 text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please enter the 6-digit code sent to your email
              <span className="block mt-1 font-medium text-foreground">{params.username}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center pt-2">

              <Form {...register}>
                <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    name="code"
                    control={register.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP 
                            maxLength={6}
                            // pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            placeholder="" 
                            {...field} 
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    disabled={code.length !== 6 || isVerifying}
                    className={`w-full h-10 flex justify-center items-center bg-primary rounded-md disabled:cursor-not-allowed cursor-pointer`}
                  > 
                    <span className="flex items-center space-x-2">
                      {isVerifying ? "Verifying..." : "Verify Account"}
                      {!isVerifying && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </Button>
                </form>
              </Form>

            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <div className="text-center text-sm">
              {countdown > 0 ? (
                <div className="text-muted-foreground flex items-center justify-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Resend code in {countdown}s</span>
                </div>
              ) : (
                <button
                  onClick={handleResendCode}
                  className="text-[#775AE9] hover:underline focus:outline-none"
                >
                  Didn&apos;t receive a code? Resend
                </button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
        
      <p className="mt-8 text-sm text-muted-foreground text-center">
        Having trouble? <a href="#" className="text-[#775AE9] hover:underline">Contact Support</a>
      </p>

    </div>
  )
}