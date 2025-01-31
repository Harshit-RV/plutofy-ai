
import { Routes,Route, useLocation } from "react-router-dom"
import { Home } from "./pages/Home";

// import { ScrollArea } from "./components/ui/scroll-area";
import { RedirectToSignIn, SignedIn, SignedOut} from "@clerk/clerk-react";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import { ReactNode } from "react";
import { NavBar } from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import AgentCreate from "./pages/AgentCreate";
import TestAgent from "./pages/TestAgent";

function App() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col">
      <div><Toaster/></div>
      {
        location.pathname == '/sign-in' || location.pathname == '/sign-up' ? null :  <NavBar />
      }

      {/* <ScrollArea className="h-full w-full px-10 rounded-md border"> */}
        <Routes>
          <Route path="/" element= { <ProtectedRoute child={<Home/>} /> }/>
          <Route path="/sign-in" element={<SignInPage/>} />
          <Route path="/create" element={ <ProtectedRoute child={<AgentCreate/>} />} />
          <Route path="/sign-up" element={<SignUpPage/>} />
          <Route path="/test/:agentDocId" element={<ProtectedRoute child={<TestAgent/>} />} />
        </Routes>
      {/* </ScrollArea> */}
      
    </div>
  );
}

const ProtectedRoute = ({ child }: { child: ReactNode }) => {
  return (
    <>
    <SignedIn> {child} </SignedIn>

    <SignedOut> 
      <RedirectToSignIn />
    </SignedOut>
    </>
  );
};

export default App
