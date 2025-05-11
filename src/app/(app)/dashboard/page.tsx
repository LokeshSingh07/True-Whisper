'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Copy, Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';




const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchloading] = useState<boolean>(false);
  const {data: session} = useSession();
  const {username} = session?.user as User || "";
  const router  = useRouter();

  // TODO: more research
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [username]);

  const copyToClipboard = ()=>{
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl)
    toast.success("profile url copied")
  }




  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })
  const { register, watch, setValue } = form
  const acceptMessage = watch('acceptMessage')




  const fetchAcceptmessage = useCallback(async()=>{
    setIsSwitchloading(true)
    try{
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessage as boolean)
    }
    catch(err){
      const axiosError = err as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message as string)
    }
    finally{
      setIsSwitchloading(false);
    }
  },[setValue])


  const fetchMessages = useCallback(async(refresh: boolean = false)=>{
    setLoading(true);
    setIsSwitchloading(false);
    try{
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || [])
      if(refresh){
        toast.success("Showing latest messages")
      }
    }
    catch(err){
      const axiosError = err as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "Internal server error")
    }
    finally{
      setIsSwitchloading(false);
      setLoading(false);
    }
  },[setIsSwitchloading, setMessages])


  const handleSwitchChange = async()=>{
    try{
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages : !acceptMessage
      });
      setValue('acceptMessage', !acceptMessage);
      toast.success(response.data.message)
    }
    catch(err){
      const axiosError = err as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message as string)
    }
  }
  
  const handleDeleteMessage = (messageId: string)=>{
    // TODO :api

    setMessages(messages.filter((message) => message._id != messageId))
  }



  useEffect(()=>{
    if(!session || !session.user) return;
    
    fetchMessages();
    fetchAcceptmessage();
  },[session, setValue, fetchAcceptmessage, fetchMessages])





  if(!session || !session.user){
    return (
      <p>No content found</p>
    )
  }


  return (
    <div className='my-8 px-4 lg:mx-auto rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      
      <div className='w-full mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link</h2>
        <div className='flex items-center justify-between w-full'>
          <input 
            type='text'
            value={profileUrl}
            disabled
            className='input input-bordered w-full'
          />
          <Button onClick={copyToClipboard} className=''><Copy/></Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>

      <Separator/>

      <Button 
        className='mt-4'
        onClick={(e)=>{
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {
          loading ? 
          <Loader2 className='h-4 w-4 animate-spin'/> :
          <RefreshCcw className='h-4 w-4'/>  
        }
      </Button>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          messages.length > 0 ? (
            messages.map((msg, idx)=> (
              <MessageCard
                key={idx}
                message={msg}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : 
          (
            <p>No message to display.</p>
          )
        }
      </div>

    </div>
  )
}

export default Dashboard 