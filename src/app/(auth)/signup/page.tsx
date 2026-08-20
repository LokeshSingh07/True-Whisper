'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
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





export default function Component() {
  // const { data: session } = useSession()
  const [username, setUsername] = useState<string>("")
  const [usernameMessage, setUsernameMessage] = useState<string>("")
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const debounced = useDebounceCallback(setUsername, 500)





  // zod implementation
  const register = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })


  useEffect(()=>{
    const checkUsernameUnique = async()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try{
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        
        }
        catch(err){
          const axiosError = err as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data?.message || "Error checking username")

        }
        finally{
          setIsCheckingUsername(false);
        }
      }
    }

    checkUsernameUnique();
  },[username])



  const onSubmit = async(data: z.infer<typeof signupSchema>)=>{
    setIsSubmitting(true);
    try{
      // console.log("Data : ", data);
      const response = await axios.post<ApiResponse>('/api/signup', data)
      toast.success(response.data.message || "verify you email to create an account")
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    }
    catch(err){
      // console.error("Error in signup of user", err)
      // @ts-ignore
      toast(err?.response?.data?.message || "Error in signup of user")
      setIsSubmitting(false)
    }
  }
 

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 py-12">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 border border-border/30 relative">
        {/* corner marks */}
        <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-border" />
        <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-border" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-border" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-border" />

        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 border border-border/50 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            <EyeOff className="h-3 w-3" />
            Open A New File
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-foreground mb-3">
            Create your account
          </h1>
          <p className="text-muted-foreground text-sm">Join to start receiving anonymous messages.</p>
        </div>
      

        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a unique username" 
                      className="bg-input border-border/25 text-foreground placeholder:text-muted-foreground rounded-sm focus-visible:ring-primary"
                      {...field}
                      onChange={(e)=> {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {isCheckingUsername && debounced.length > 2
                      ? <span className="text-muted-foreground">Checking availability...</span>
                      : usernameMessage && <span className={usernameMessage != "username is available" ? "text-destructive" : "text-[#6FA96F]"}>{usernameMessage}</span>}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
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
                      placeholder="Create a secure password"
                      type="password"
                      className="bg-input border-border/25 text-foreground placeholder:text-muted-foreground rounded-sm focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating your account...
                  </>
                ) : ("Sign Up")
              }
            </Button>
          </form>
        </Form>


        <p className="text-sm text-muted-foreground text-center">
          Already have an account?
          <Link href={"/signin"} className='ml-2 text-primary hover:text-[#2563EB] hover:underline'>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}