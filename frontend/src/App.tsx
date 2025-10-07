
import { Routes,Route, useLocation } from "react-router-dom"
import Agents from "./pages/Agents";

// import { ScrollArea } from "./components/ui/scroll-area";
import { SignInPage } from "./pages/SignIn";
import { SignUpPage } from "./pages/SignUp";
import { NavBar } from "./components/common/NavBar";
import { Toaster } from "react-hot-toast";
import AgentCreate from "./pages/AgentCreate";
import TestAgent from "./pages/TestAgent";
import WorkflowBuilder from "./pages/WorkflowBuilderPage";
import Workflows from "./pages/Workflows";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AGENTS_BASE_ROUTE, WORKFLOWS_BASE_ROUTE } from "./config";


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
          <Route path={`/${AGENTS_BASE_ROUTE}`} element= { <ProtectedRoute child={<Agents />} /> }/>
          <Route path="/sign-in" element={<SignInPage/>} />
          <Route path="/sign-up" element={<SignUpPage/>} />


          <Route path={`/${AGENTS_BASE_ROUTE}/create`} element={ <ProtectedRoute child={<AgentCreate mode="CREATE"/>} />} />
          <Route path={`/${AGENTS_BASE_ROUTE}/edit/:agentDocId`} element={ <ProtectedRoute child={<AgentCreate mode="EDIT"/>} />} />
          <Route path={`/${AGENTS_BASE_ROUTE}/:agentDocId`} element={<ProtectedRoute child={<TestAgent isTestMode={false} />} />} />
          <Route path={`/${AGENTS_BASE_ROUTE}/:agentDocId/test`} element={<ProtectedRoute child={<TestAgent isTestMode/>} />} />


          <Route path="/" element={<ProtectedRoute child={<Workflows />} />} />
          <Route path={`/${WORKFLOWS_BASE_ROUTE}/:workflowDocId`} element={<ProtectedRoute child={<WorkflowBuilder />} />} />

        </Routes>
      {/* </ScrollArea> */}
      
    </div>
  );
}

export default App
