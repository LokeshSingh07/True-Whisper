'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { EyeOff, LogOut, Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter()
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    router.push("/");
  }

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-6 py-4 border-b border-border bg-background'>
      <div className='container mx-auto flex flex-row justify-between items-center'>
        <Link href='/' className='flex flex-row gap-2 items-center'>
          <EyeOff className="w-5 h-5 text-primary" />
          <span className="font-mono font-bold text-foreground">TrueWhisper</span>
        </Link>
        {
          session ? (
            <div className='flex items-center gap-2'>
              {
                user.username && pathname != '/dashboard' &&
                (<Button className='hidden lg:inline-flex rounded-sm border-border/40 text-foreground bg-transparent hover:bg-foreground/5'
                  variant={"outline"}
                  onClick={() => { router.push("/dashboard") }}
                >Dashboard</Button>)
              }
              <Button
                className='group rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-150 active:scale-95 disabled:opacity-70'
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Link href={"/signin"}>
              <Button className='rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-150 active:scale-95'>
                Login
              </Button>
            </Link>
          )
        }
      </div>
    </div>
  )
}

export default Navbar