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
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
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

    setMessages(messages.filter((message) => message._id != messageId))
  }

  const handleMessageRead = (messageId: string) => {
    // @ts-ignore
    setMessages(prevMessages => {
      const updated = prevMessages.map(message =>
        message._id === messageId
          ? { ...message, read: true }
          : message
      );
      // console.log("updated : ", updated);
      return updated;
    });
  };
  



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

  
  // Filter messages only once before mapping them
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'read') return msg.read === true;
    if (filter === 'unread') return msg.read === false;
    return true;
  });


  return (
    <div className='my-8 px-4 lg:mx-auto rounded w-full max-w-6xl'>
      {/* <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1> */}
      
      <div className='w-full mb-6'>
        <h2 className="text-xl font-semibold mb-2">Your Unique Message Link</h2>
        <div className='flex items-center justify-between w-full gap-2'>
          <input 
            type='text'
            value={profileUrl}
            disabled
            className='input input-bordered w-full'
          />
          <Button onClick={copyToClipboard} variant={"secondary"} size="icon" title="Copy Link"><Copy/></Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Share this link with others so they can send you anonymous messages.
        </p>
      </div>

      <div className='mb-6 flex items-center'>
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-base">
          Accepting messages is <strong>{acceptMessage ? 'enabled' : 'disabled'}</strong>
        </span>
      </div>

      <Separator/>

      <Button 
        className='mt-4'
        onClick={(e)=>{
          e.preventDefault()
          fetchMessages(true)
        }}
        variant={"secondary"}
      >
        {
          loading ? 
          <Loader2 className='h-4 w-4 animate-spin'/> :
          <RefreshCcw className='h-4 w-4'/>  
        }
      </Button>

      {/* 🆕 Filter Buttons */}
      <div className='mt-6 flex gap-2 items-center'>
        <Button
          variant={filter === 'all' ? 'default' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'secondary'}
          onClick={() => setFilter('read')}
        >
          Read
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'secondary'}
          onClick={() => setFilter('unread')}
        >
          Unread
        </Button>
      </div>

      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          filteredMessages.length > 0 
          ? (
            filteredMessages.map((msg, idx)=> (
              <MessageCard
                key={msg._id as string}
                message={msg}
                onMessageDelete={handleDeleteMessage}
                onMessageRead={handleMessageRead}
              />
            ))
          ) : 
          (
            <p className="text-muted-foreground">No messages to display yet.</p>
          )
        }
      </div>

    </div>
  )
}

export default Dashboard 