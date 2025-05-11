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
import { Loader2 } from "lucide-react"





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
      toast(err?.response?.data?.message || "Error in signup of user")
      setIsSubmitting(false)
    }
  }
 

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join TrueWhisper
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
      

        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" 
                      {...field}
                      onChange={(e)=> {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {isCheckingUsername && debounced.length > 2
                      ? "Checking username..." 
                      : usernameMessage && <span className={`${usernameMessage != "username is available" ? "text-red-500" : "text-green-500"}`}>{usernameMessage}</span>}
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you email" {...field}/>
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
                    <Input placeholder="******" type="password" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} >
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ("SignUp")
              }
            </Button>
          </form>
        </Form>


        <p className="mt-8 text-sm text-muted-foreground text-center">
          Already have an account? 
          <Link href={"/signin"} className='w-full mx:w-auto ml-2 text-[#775AE9] hover:underline'>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}