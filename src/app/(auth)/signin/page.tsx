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
import { Loader2 } from "lucide-react"
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join TrueWhisper
          </h1>
          <p className="mb-4">Sign in to start your anonymous messages.</p>
        </div>
      

        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you email or username" {...field}/>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" type="password" {...field}/>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} >
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
          
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Don&apos;t Have an account? 
          <Link href={"/signup"} className='w-full mx:w-auto ml-2 text-[#775AE9] hover:underline'>
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}