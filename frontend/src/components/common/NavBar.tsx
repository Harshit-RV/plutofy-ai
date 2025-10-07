import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import { AGENTS_BASE_ROUTE } from "@/config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    return (
        <SignedIn>  
          <div className="w-full h-14 bg-background border-b items-end flex px-4 sm:px-8 md:px-16 lg:px-20 justify-between">
                
                <div className="flex h-full">
                  <img src="/Plutofy-Logo.png" onClick={()=> navigate('/')}  alt="image" className="rounded-t-sm bg-[#553566] min-w-12 flex items-end mt-4 mr-6 px-2.5 aspect-square object-contain hover:cursor-pointer" />
                  <div className="sm:flex h-full hidden">
                    <NavBarItem
                      pathname={location.pathname} 
                      link="/"
                      toolTipContext="Bring your own keys/credentials"
                      title="Workflows"
                    />
                    <NavBarItem 
                      pathname={location.pathname}
                      link={`/${AGENTS_BASE_ROUTE}`}
                      title="Managed Agents"
                      toolTipContext="Fully managed service for you"
                    />
                  </div>
                </div>
                
                <div className="h-full flex items-center gap-6">
                  <ThemeToggleButton />
                  <UserButton />
                </div>
  
            </div>
        </SignedIn>
    )  
}

interface NavBarItemProps {
    pathname: string;
    link: string;
    title: string;
    toolTipContext: string;
  }
  
export const NavBarItem = (args: NavBarItemProps) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link to={args.link} className="h-full hover:cursor-pointer flex flex-col justify-between">
                <div></div> <div></div> <div></div>
                
                <Button type="text" className={`rounded-lg font-semibold ${args.pathname == args.link ? ' text-black dark:text-white' : 'text-gray-500 dark:text-gray-400' } `}>{args.title}</Button>
                
                <div className={`h-0.5 ${args.pathname == args.link ? 'bg-black dark:bg-white' : ''}`}></div>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{args.toolTipContext}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
}