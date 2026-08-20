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
import { Loader2, Sparkle, EyeOff } from 'lucide-react';
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
    <div className='w-full bg-background min-h-screen'>
      <div className='max-w-3xl mx-auto px-4 py-20'>

        <div className='min-h-[30vh]'>
          <div className="text-center mb-10">
            <div className="mb-5 inline-flex items-center gap-2 border border-border/50 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              <EyeOff className="h-3 w-3" />
              Drop Box Open
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-mono text-foreground mb-2">
              Send an Anonymous Message
            </h1>
            <p className="text-muted-foreground text-sm">
              To <span className="font-mono text-foreground">@{username}</span> — nothing here is traced back to you.
            </p>
          </div>

          {/* form */}
          <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="content"
                control={register.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                      Your Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here..."
                        className='h-36 resize-none bg-card text-card-foreground placeholder:text-muted-foreground/50 border-border/30 rounded-sm font-mono focus-visible:ring-primary'
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-8 py-5"
              >
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
        <div className='flex flex-col gap-4 mt-16'>
          <div className="h-px bg-border/20 mb-2" />

          <Button
            onClick={()=> handleSuggestMessage()}
            className='w-fit bg-transparent border border-border/50 text-foreground hover:bg-foreground/5 rounded-sm'
            disabled={isSuggestLoading}
          >
            {isSuggestLoading 
            ? (<>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) 
            : (<>
                <Sparkle className="h-4 w-4 mr-2" /> Generate Suggestions
            </>)}
          </Button>

          <p className='text-sm text-muted-foreground'>Select a suggested message to use it instantly.</p>

          <div className="w-full flex flex-col border border-border/30 p-5 sm:p-6">
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
              Suggested Messages
            </p>

            <div className='w-full flex flex-col gap-3'>
              {
                error 
                ? ( <p className="text-destructive text-sm">{error.message}</p>) 
                : (
                  suggestions.map((message, index) => (
                    <button
                      key={index}
                      onClick={() => handleClickSuggestion(message)}
                      className="text-left bg-card text-card-foreground p-4 text-sm leading-relaxed font-mono hover:bg-card/90 transition-colors rounded-sm"
                    >
                      {message}
                    </button>
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