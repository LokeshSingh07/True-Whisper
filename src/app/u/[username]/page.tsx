'use client'
import { Button } from '@/components/ui/button'
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl,
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { z } from "zod"
import { Loader2 } from 'lucide-react';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { Textarea } from '@/components/ui/textarea';



const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const params = useParams();
  const username = params.username;
    




  // zod implementation
  const register = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })


  const onSubmit = async(data: z.infer<typeof messageSchema>)=>{
    setIsSubmitting(true);
    try{
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username, 
        content: data.content
      })
      
      // console.log("response: ", response)
      toast.success("Message submitted anonymously");
    }
    catch(err){
      const axiosError = err as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "Something went wrong");
    }
    finally{
      setIsSubmitting(false);
      register.reset();
    }
  }
 



  const handleSuggestMessage = ()=>{
    const samples = [
      "You're doing a great job—keep going!",
      "Your leadership is truly inspiring.",
      "Try being a little more approachable in team meetings.",
      "Your work ethic sets a strong example!",
      "Could we maybe improve communication during projects?"
    ];

    const random = samples.sort(()=> 0.5-Math.random()).slice(0,3);
    setSuggestions(random);
  }

  
  const handleClickSuggestion = (msg: string)=>{
    register.setValue("content", msg);
  }


  return (
    <div className='w-full '>
      <div className='max-w-4xl mx-auto'>     
        <div className='min-h-[40vh]'>
          <p className='text-center text-3xl font-bold mt-10'>Public profile Link</p>
          
          {/* <p>Send Anonymous Message @{username}</p> */}
          {/* form */}
          <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="content"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Anonymous Message @{username}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter you message" rows={5} {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} >
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...
                    </>
                  ) : ("Send it")
                }
              </Button>
            </form>
          </Form>



        </div>

        {/* suggest msg -> AI */}
        <div className='flex flex-col gap-4'>
          <Button onClick={handleSuggestMessage} className='w-fit'>
            Suggest Message
          </Button>

          <p>Click on any message below to select it</p>

          <div className="flex flex-col border p-4">
            <p className='text-lg font-semibold'>Messages</p>

            {
              suggestions.length > 0 ? 
              (<div className='grid sm:grid-cols-2 gap-2'>
                {
                  suggestions.map((suggestion, idx)=>(
                    <p key={idx} onClick={()=> handleClickSuggestion(suggestion)}>{suggestion}</p>
                  ))
                }
              </div>) : 
              (<div>No suggestion yet.</div>)      
            }
          </div>  
        </div>   
        
      </div>
    </div>
  )
}

export default Page