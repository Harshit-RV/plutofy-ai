
import { Routes,Route, useLocation } from "react-router-dom"
import { Home } from "./pages/Home";

// import { ScrollArea } from "./components/ui/scroll-area";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import { NavBar } from "./components/common/NavBar";
import { Toaster } from "react-hot-toast";
import AgentCreate from "./pages/AgentCreate";
import TestAgent from "./pages/TestAgent";
import ApiKeys from "./pages/ApiKeys";
import WorkflowBuilder from "./pages/WorkflowBuilderPage";
import Workflows from "./pages/Workflows";
import ProtectedRoute from "./components/common/ProtectedRoute";


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
          <Route path="/sign-up" element={<SignUpPage/>} />


          <Route path="/agent/create" element={ <ProtectedRoute child={<AgentCreate mode="CREATE"/>} />} />
          <Route path="/agent/edit/:agentDocId" element={ <ProtectedRoute child={<AgentCreate mode="EDIT"/>} />} />
          <Route path="/agent/:agentDocId" element={<ProtectedRoute child={<TestAgent isTestMode={false} />} />} />
          <Route path="/agent/:agentDocId/test" element={<ProtectedRoute child={<TestAgent isTestMode/>} />} />


          <Route path="/workflow" element={<ProtectedRoute child={<Workflows />} />} />
          <Route path="/workflow/:workflowDocId" element={<ProtectedRoute child={<WorkflowBuilder />} />} />


          <Route path="/api" element={<ProtectedRoute child={<ApiKeys/>} />} />
        </Routes>
      {/* </ScrollArea> */}
      
    </div>
  );
}

export default App
