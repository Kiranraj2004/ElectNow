import { useAuth0 } from '@auth0/auth0-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"

import {
  LogOut, 
} from "lucide-react"

import { asset } from '@/assets/asset';


const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return isAuthenticated ? (
    <div className="flex flex-row mr-14 ">
    
          <DropdownMenu>
      <DropdownMenuTrigger> {user.name}</DropdownMenuTrigger>
      <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
          <LogOut />
          <span onClick={()=> logout({ returnTo: window.location.origin })}>Log out</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  ) : (
    <button onClick={loginWithRedirect} className="mr-12">Login</button>
  );
};

export default AuthButton;
