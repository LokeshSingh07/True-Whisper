'use client'
import React from 'react'
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
import { X } from 'lucide-react'
import { Message } from '@/model/User'


type MessageCardProps = {
    message: Message, 
    onMessageDelete: (messageId: string)=> void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {





    const handleDeleteConfirm = async()=>{
        // const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        // toast.success(response.data.message)
        // @ts-ignore
        onMessageDelete(message._id)
    }



  return (
    <Card>
        <CardHeader>
            {/* <CardTitle>Card Title</CardTitle> */}
            
            {/* Alert */}
            <AlertDialog>
                <div className='w-full flex justify-between'>
                    <div>{new Date(message.createdAt).toLocaleString('en-US', {dateStyle: 'medium'})}</div>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className='w-fit'><X className='w-5 h-5'/></Button>
                    </AlertDialogTrigger>
                </div>
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
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent>
            <p>{message.content}</p>
        </CardContent>
    </Card>

  )
}

export default MessageCard