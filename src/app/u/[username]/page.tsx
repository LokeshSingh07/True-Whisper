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
import { Loader2, Sparkle } from 'lucide-react';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { useCompletion } from '@ai-sdk/react'


const specialChar = "||";
const initialMessageString = "What recent experience taught you something valuable?||If you could meet any influential person, past or present, who would it be?||What motivates you to keep improving each day?";
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};


const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<string[]>(parseStringMessages(initialMessageString));
  const params = useParams();
  const username = params.username;
    
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });





  // zod implementation
  const register = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })

  const messageContent = register.watch("content");

  const onSubmit = async(data: z.infer<typeof messageSchema>)=>{
    setIsSubmitting(true);
    try{
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username, 
        content: data.content
      })
      
      // console.log("response: ", response)
      toast.success("Your message has been submitted anonymously.");
    }
    catch(err){
      const axiosError = err as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "An unexpected error occurred.");
    }
    finally{
      setIsSubmitting(false);
      register.reset();
    }
  }
 



  const handleSuggestMessage = async()=>{
    setLoading(true)
    try{
      const result = await complete("");
      // console.log("result : ", result);
      // @ts-ignore
      setSuggestions(parseStringMessages(result)); 
    }
    catch(err){
      toast("Unable to generate suggestions at the moment. Please try again.");
    }
    finally{
      setLoading(false);
    }
  }

  
  const handleClickSuggestion = (msg: string)=>{
    register.setValue("content", msg);
  }


  return (
    <div className='w-full '>
      <div className='max-w-4xl mx-auto px-4'>     
        <div className='min-h-[40vh]'>
          <p className='text-center text-3xl font-bold my-10'>Send an Anonymous Message</p>
          
          {/* <p>Send Anonymous Message @{username}</p> */}
          {/* form */}
          <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="content"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to @{username}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your message here..." className='h-32 resize-none' {...field}/>
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
                  ) : ("Send Message")
                }
              </Button>
            </form>
          </Form>



        </div>

        {/* suggest msg -> AI */}
        <div className='flex flex-col gap-4 mt-14'>
          <Button onClick={()=> handleSuggestMessage()} className='w-fit' disabled={isSuggestLoading}>
            {isSuggestLoading 
            ? (<>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) 
            : (<>
                <Sparkle/> Generate Suggestions
            </>)}
          </Button>

          <p className='text-muted-foreground'>Select a suggested message to use it instantly</p>

          <div className="w-full flex flex-col border p-4 rounded-md shadow-sm">
            <p className='text-lg font-semibold mb-2'>Suggested Messages</p>

            <div className='w-full'>
              {
                error 
                ? ( <p className="text-red-500">{error.message}</p>) 
                : (
                  suggestions.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="mb-2 text-left justify-start whitespace-normal"
                      onClick={() => handleClickSuggestion(message)}
                    >
                      {message}
                    </Button>
                  ))
                )
              }
            </div> 
          </div>  
        </div>   
        
      </div>
    </div>
  )
}

export default Page