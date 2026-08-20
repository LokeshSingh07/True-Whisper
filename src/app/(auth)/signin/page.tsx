'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  Form, 
  FormControl,
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, EyeOff } from "lucide-react"
import { signinSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"
import Link from "next/link"





export default function Component() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter();




  // zod implementation
  const register = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })




  const onSubmit = async(data: z.infer<typeof signinSchema>)=>{
    setIsSubmitting(true);
    try{
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      
      // console.log("result : ", result)
      
      if(result?.error){
        toast("Incorrect username or password")
      }
      
      if(result?.url){
        router.replace("/dashboard")
      }
    }
    catch(err){
      toast.error("Something went wrong. Please try again.");
    }
    finally{
      setIsSubmitting(false);
    }
  }
 

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 border border-border/30 relative">
        {/* corner marks */}
        <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-border" />
        <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-border" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-border" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-border" />

        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 border border-border/50 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            <EyeOff className="h-3 w-3" />
            Access Your File
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-foreground mb-3">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">Sign in to start reading your anonymous messages.</p>
        </div>
      

        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Email or Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      className="bg-input border-border/25 text-foreground placeholder:text-muted-foreground rounded-sm focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      className="bg-input border-border/25 text-foreground placeholder:text-muted-foreground rounded-sm focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm py-5"
            >
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Signing in...
                  </>
                ) : ("Sign In")
              }
            </Button>
          </form>
        </Form>
          
        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?
          <Link href={"/signup"} className='ml-2 text-primary hover:text-[#2563EB] hover:underline'>
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}