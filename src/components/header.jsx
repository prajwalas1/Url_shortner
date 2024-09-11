import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOutIcon } from 'lucide-react';
import { UrlState } from '@/context';
import useFetch from '@/hooks/use-fetch';
import { logout } from '@/db/apiAuth';
import { BarLoader } from 'react-spinners';
 
const Header = () => {

     const navigate = useNavigate();
    const {user , fetchUser} = UrlState();

     const {loading , fn:fnLogout} = useFetch(logout);

  return (
    <>
    <nav className='flex items-center justify-between py-10 ml-1 overflow-hidden sm:m-auto'>
        <Link to="/">
        <img src="/trimlogo.png" alt=' trimmer logo' className='h-20 mr-9 ' /> 
        </Link>
        <div className='ml-2' >
            { !user ?
            <Button onClick={() => navigate("/auth")}>Login</Button>
            : (
                <DropdownMenu>
  <DropdownMenuTrigger className='w-10 overflow-hidden rounded-full'>
  <Avatar>
  <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
  <AvatarFallback>PA</AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Link to="/dashboard">
        <LinkIcon className='w-4 h-4 mr-2'/>
        My Links
        </Link>
        </DropdownMenuItem>
    <DropdownMenuItem className = "text-red-400">
        <LogOutIcon className='w-4 h-4 mr-2'/>
       <span onClick={() => {
        fnLogout().then(() => {
          fetchUser();
          navigate("/");
        })
       }}>Logout</span> </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

            )
             } 

        </div>
        {loading && <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>}
    </nav>
    </>
  )
}

export default Header; 