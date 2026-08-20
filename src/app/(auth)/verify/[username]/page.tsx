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
import { ArrowRight, Clock, EyeOff } from "lucide-react";
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
      // console.error("Error resending code:", err);
      toast("Failed to resend code.");
    }
  }


  const onSubmit = async(data: z.infer<typeof verifySchema>)=>{
    setIsVerifying(true);
    try{
      // console.log("data : ", data);
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code
      });

      toast(response.data.message || "success")
      router.replace(`/signin`)
    }
    catch(err){
      // console.log("Error in signup of user ", err)
      // err?.response?.data?.message 
      const errorMessage = "Signup failed";
      toast(errorMessage)
    }
    finally{
      setIsVerifying(false)
    }
  } 

 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="relative border border-border/30 p-8 sm:p-10">
          {/* corner marks */}
          <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-border" />
          <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-border" />
          <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-border" />
          <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-border" />

          <div className="space-y-1 text-center mb-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-border/50">
              <EyeOff className="h-6 w-6 text-primary" strokeWidth={1.75} />
            </div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
              Identity Verification
            </p>
            <h1 className="text-2xl font-bold font-mono text-foreground">Verify your account</h1>
            <p className="text-muted-foreground text-sm pt-1">
              Enter the 6-digit code sent to your email
              <span className="block mt-1 font-mono text-foreground">{params.username}</span>
            </p>
          </div>

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
                            <InputOTPSlot index={0} className="border-[#9C8B5E]/40 bg-[#0F0F13] text-[#ECE6D6]" />
                            <InputOTPSlot index={1} className="border-[#9C8B5E]/40 bg-[#0F0F13] text-[#ECE6D6]" />
                            <InputOTPSlot index={2} className="border-[#9C8B5E]/40 bg-[#0F0F13] text-[#ECE6D6]" />
                            <InputOTPSlot index={3} className="border-[#9C8B5E]/40 bg-[#0F0F13] text-[#ECE6D6]" />
                            <InputOTPSlot index={4} className="border-[#9C8B5E]/40 bg-[#0F0F13] text-[#ECE6D6]" />
                            <InputOTPSlot index={5} className="border-[#9C8B5E]/40 bg-[#0F0F13] text-[#ECE6D6]" />
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
                  className="w-full h-11 flex justify-center items-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                > 
                  <span className="flex items-center space-x-2">
                    <span>{isVerifying ? "Verifying..." : "Verify Account"}</span>
                    {!isVerifying && <ArrowRight className="w-4 h-4" />}
                  </span>
                </Button>
              </form>
            </Form>

          </div>

          <div className="flex flex-col space-y-3 pt-8">
            <div className="text-center text-sm">
              {countdown > 0 ? (
                <div className="text-[#8F8F98] flex items-center justify-center font-mono text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>Resend code in {countdown}s</span>
                </div>
              ) : (
                <button
                  onClick={handleResendCode}
                  className="text-primary hover:text-[#2563EB] hover:underline focus:outline-none text-sm"
                >
                  Didn&apos;t receive a code? Resend
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
        
      <p className="mt-8 text-sm text-muted-foreground text-center">
        Having trouble? <a href="#" className="text-primary hover:text-[#2563EB] hover:underline">Contact Support</a>
      </p>

    </div>
  )
}