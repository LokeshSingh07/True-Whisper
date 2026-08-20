'use client'
import React, { useState } from 'react'
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
            onMessageDelete(String(message._id))
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
    <div
        className={`relative bg-card text-card-foreground p-6 transition-shadow ${
            isRead ? "shadow-[4px_4px_0_0_rgba(0,0,0,0.25)]" : "shadow-[4px_4px_0_0_rgb(59,130,246)]"
        }`}
    >
        {/* unread seal */}
        {!isRead && (
            <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-primary border-2 border-card-foreground" />
        )}

        <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                </span>

                {!isRead && (
                    <Button
                        onClick={markAsRead}
                        variant="outline"
                        size="sm"
                        className="w-fit border-card-foreground/30 text-card-foreground hover:bg-card-foreground/5 bg-transparent rounded-sm text-xs"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Mark as Read
                    </Button>
                )}
            </div>

            {/* Alert */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-card-foreground/50 hover:text-primary hover:bg-primary/10 rounded-sm">
                        <X className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background border border-border/30 text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-mono text-foreground">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. This will permanently delete your
                            data and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border border-border/40 text-foreground hover:bg-foreground/5 hover:text-foreground rounded-sm">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

        <p className="text-base leading-relaxed text-card-foreground/70 whitespace-pre-wrap font-mono">
            {message.content}
        </p>
    </div>

  )
}

export default MessageCard