import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { FeedbackComponent } from "./FeedbackComponent";

export const NavBar = () => {
    const location = useLocation();
  
    return (
        <SignedIn>  
          <div className="w-full h-14 bg-white items-end flex px-4 sm:px-8 md:px-16 lg:px-20 justify-between">
                
                <div className="flex h-full">
                <img src="/Plutofy-Logo.png" onClick={()=> window.open("https://plutofy.live/", "_blank")}  alt="image" className="rounded-t-sm bg-[#553566] min-w-12 flex items-end mt-4 mr-6 px-2.5 aspect-square object-contain hover:cursor-pointer" />
                  <div className="sm:flex h-full hidden">
                    <NavBarItem pathname={location.pathname} link="/" title="Home" />
                    <NavBarItem pathname={location.pathname} link="/create" title="Create Monitor" />
                  </div>
                </div>
                
  
                <div className="h-full flex items-center gap-5">
                  <FeedbackComponent />
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
  }
  
export const NavBarItem = (args: NavBarItemProps) => {
    return (
        <Link to={args.link} className="h-full flex flex-col justify-between">
            <div></div> <div></div> <div></div>
            
            <Button type="text" className={`rounded-lg  font-semibold ${args.pathname == args.link ? ' text-black' : 'text-gray-500' } `}>{args.title}</Button>
            
            <div className={`h-0.5 ${args.pathname == args.link ? 'bg-black' : ''}`}></div>
        </Link>
    )
}