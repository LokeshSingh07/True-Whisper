'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'



const Navbar = () => {
    const { data:session } = useSession();
    const user:User = session?.user as User;
    const router = useRouter()


  return (
    <div className='max-w-7xl mx-auto p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-row justify-between items-center'>
        <Link href='/' className='flex flex-row gap-2 items-center'>
          <MessageSquare className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold gradient-text">TrueWhisper</span>
        </Link>
        {
          session ? (
            <>
              <span className='mr-4 hidden lg:block'>Welcome {user?.username || user?.email}</span>
              <Button className='w-fit mx:w-auto rounded-full' 
                onClick={()=> {
                  signOut()
                  router.push("/")
                }}
              >Logout</Button>
            </>
          ) : (
            <Link href={"/signin"}>
              <Button className='w-fit mx:w-auto rounded-full' >Login</Button>
            </Link>
          )
        }
      </div>
    
    
    </div>
  )
}

export default Navbar