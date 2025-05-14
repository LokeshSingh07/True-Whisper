'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Eye, X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'


type MessageCardProps = {
    message: Message, 
    onMessageDelete: (messageId: string)=> void
    onMessageRead: (messageId: string)=> void
}

const MessageCard = ({message, onMessageDelete, onMessageRead}: MessageCardProps) => {
    const [isRead, setIsRead] = useState<boolean>(message.read);



    const markAsRead = async () => {
        if (isRead) return; // already read
        try {
            setIsRead(true)
            const response = await axios.patch<ApiResponse>(`/api/mark-as-read/${message._id}`)
            toast.info(response.data.message || "Marked as read")
            
            // update parent component state
            onMessageRead(message._id as string)
        }
        catch (err) {
            // @ts-ignore
            toast(err?.response.data.message || "Error in marking as read")
            setIsRead(false);
        }
    }


    const handleDeleteConfirm = async()=>{
        try{
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast.success(response.data.message)
            // @ts-ignore
            onMessageDelete(message._id)
        }
        catch(err){
            toast("Error in deleting message");
        }
    }



  return (
    <Card className={`relative border-primary/20 hover:border-primary/40 shadow-lg rounded-2xl transition hover:shadow-xl ${isRead == true ? "" : "border-blue-500"}`}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="w-full flex justify-between items-center">
                <div className='text-muted-foreground text-sm'>
                    {new Date(message.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                </div>
        
                <div>
                    {isRead === false && (
                        <Button
                        onClick={markAsRead}
                        variant="outline"
                        className="mt-1 text-sm flex items-center gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            Mark as Read
                        </Button>
                    )}  
                </div>
            </div>
            
            {/* Alert */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-destructive/10 hover:bg-destructive/20 transition-all duration-200">
                        <X className="h-5 w-5 text-destructive" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            data and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-white hover:bg-destructive/90"
                        >Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent>
            <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">{message.content}</p>
        </CardContent>
    </Card>

  )
}

export default MessageCard