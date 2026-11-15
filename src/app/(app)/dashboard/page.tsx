'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const POLL_INTERVAL = 15000;

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchloading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const {data: session, status} = useSession();
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const {username} = session?.user as User || "";
  const router  = useRouter();

  // ids of messages we've already seen, used to detect new ones
  const knownIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

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


  // silent = background poll: no spinner, no error toasts
  const fetchMessages = useCallback(async(refresh: boolean = false, silent: boolean = false)=>{
    if (!silent) setLoading(true);
    try{
      const response = await axios.get<ApiResponse>('/api/get-messages', {
        params: { _t: Date.now() },
        headers: { 'Cache-Control': 'no-cache' },
      });
      const fetched: Message[] = response.data.messages || [];

      // detect new messages (skip on the very first load)
      const newOnes = fetched.filter((m) => !knownIdsRef.current.has(String(m._id)));
      if (!isFirstLoadRef.current && newOnes.length > 0) {
        toast.info(
          newOnes.length === 1
            ? "You have a new message"
            : `You have ${newOnes.length} new messages`
        );
      }
      knownIdsRef.current = new Set(fetched.map((m) => String(m._id)));
      isFirstLoadRef.current = false;

      setMessages(fetched);
      if(refresh){
        toast.success("Showing latest messages")
      }
    }
    catch(err){
      if (!silent) {
        const axiosError = err as AxiosError<ApiResponse>
        toast(axiosError.response?.data.message || "Internal server error")
      }
    }
    finally{
      if (!silent) setLoading(false);
      setHasLoadedOnce(true);
    }
  },[])


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
  
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => String(message._id) !== messageId))
  }

  const handleMessageRead = (messageId: string) => {
    setMessages((prevMessages: Message[]) =>
      prevMessages.map((message) =>
        String(message._id) === messageId
          ? ({ ...message, read: true } as Message)
          : message
      )
    );
  };
  


  const isAuthed = !!session?.user;

  // initial load
  useEffect(()=>{
    if(!isAuthed) return;
    
    fetchMessages();
    fetchAcceptmessage();
  },[isAuthed, fetchAcceptmessage, fetchMessages])


  // auto refresh: poll while the tab is visible + refetch when tab regains focus
  useEffect(() => {
    if (!isAuthed) return;

    const poll = () => {
      if (document.visibilityState === 'visible') {
        fetchMessages(false, true);
      }
    };

    const intervalId = setInterval(poll, POLL_INTERVAL);
    document.addEventListener('visibilitychange', poll);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [isAuthed, fetchMessages]);





  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!session || !session.user){
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-mono text-sm text-muted-foreground">No content found</p>
      </div>
    )
  }

  
  // Filter messages only once before mapping them
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'read') return !!msg.read;
    if (filter === 'unread') return !msg.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="bg-background min-h-screen">
      <div className='my-0 px-4 py-10 lg:mx-auto w-full max-w-6xl'>

        <div className="mb-8">
          <p className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
            Case File — {username || "Agent"}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
            Your Inbox
          </h1>
        </div>

        {/* Drop-box link */}
        <div className='w-full mb-8 border border-border/30 p-5 sm:p-6'>
          <h2 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-3">
            Your Drop Box Link
          </h2>
          <div className='flex items-center justify-between w-full gap-2'>
            <input
              type='text'
              value={profileUrl}
              disabled
              className='w-full bg-input border border-border/25 px-3 py-2 font-mono text-sm text-foreground rounded-sm disabled:opacity-80'
            />
            <Button
              onClick={copyToClipboard}
              size="icon"
              title="Copy Link"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Share this link with others so they can send you anonymous messages.
          </p>
        </div>

        {/* Accepting toggle */}
        <div className='mb-8 flex items-center justify-between border border-border/30 px-5 py-4'>
          <span className="text-sm text-muted-foreground">
            Accepting messages is{" "}
            <strong className={acceptMessage ? "text-foreground" : "text-muted-foreground"}>
              {acceptMessage ? "enabled" : "disabled"}
            </strong>
          </span>
          <Switch
            {...register('acceptMessage')}
            checked={acceptMessage}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          {/* Filter tabs */}
          <div className='flex gap-6 font-mono text-xs tracking-widest uppercase'>
            {(['all', 'read', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`pb-2 border-b-2 transition-colors ${
                  filter === f
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={(e)=>{
              e.preventDefault()
              fetchMessages(true)
            }}
            variant="outline"
            size="icon"
            className="border-border/40 text-foreground hover:bg-foreground/5 bg-transparent rounded-sm"
            title="Refresh"
          >
            {
              loading ?
              <Loader2 className='h-4 w-4 animate-spin'/> :
              <RefreshCcw className='h-4 w-4'/>
            }
          </Button>
        </div>

        <div className="h-px bg-border/20 mb-8" />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {
            filteredMessages.length > 0
            ? (
              filteredMessages.map((msg)=> (
                <MessageCard
                  key={String(msg._id)}
                  message={msg}
                  onMessageDelete={handleDeleteMessage}
                  onMessageRead={handleMessageRead}
                />
              ))
            ) :
            (
              <div className="md:col-span-2 border border-dashed border-border/30 py-16 text-center">
                {!hasLoadedOnce ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                ) : (
                  <p className="font-mono text-sm text-muted-foreground">
                    No messages to display yet.
                  </p>
                )}
              </div>
            )
          }
        </div>

      </div>
    </div>
  )
}

export default Dashboard