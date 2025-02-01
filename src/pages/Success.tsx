"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ButtonCN } from "@/components/ui/buttoncn"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, Copy, CheckCircle, Rocket, ChevronRight, ChevronLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"

export default function AIDeploymentSuccess( { agentId, name } : { agentId: string, name: string} ) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 font-mono flex items-center justify-center p-4 pb-32">
      <div className="flex h-min">
        <Card className="w-full h-min max-w-lg p-[1.5vh]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Deployment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-7 text-md">Your AI agent has been successfully deployed and is now ready to use.</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Agent Name:</span>
                <span className="text-sm font-semibold">{name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Agent ID:</span>
                <span className="text-sm font-mono">{agentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="text-sm font-semibold text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <ButtonCN className="w-full h-10" onClick={() => setIsExpanded(!isExpanded)}>
              <Rocket className="mr-2 h-4 w-4" />
              Connect to Agent
              {isExpanded ? <ChevronLeft className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
            </ButtonCN>
            <div className="flex space-x-2 w-full">
              {/* <ButtonCN variant="outline" className="flex-1">
                <Settings className="mr-2 h-4 w-4" /> Edit
              </ButtonCN> */}
              <Link to={"/"} className="flex-1">
                <ButtonCN variant="outline" className="w-full">
                  Go to Dashboard
                </ButtonCN>
              </Link>
            </div>
          </CardFooter>
        </Card>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 1, marginLeft: "0px" }}
              animate={{ width: "auto", opacity: 1, marginLeft: "15px" }}
              exit={{ width: 0, opacity: 1, marginLeft: "0px" }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded shadow-sm"
            >
              <ConnectCard/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


function ConnectCard() {
  return (
    <Card className="h-full w-[500px] overflow-hidden">
      <CardHeader className="bg-gradient-to-r py-4 from-gray-900 via-gray-800 to-gray-700 text-white">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5" />
          <CardTitle className="text-xl font-semibold">Connect to Agent</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 py-4 px-6 h-full">
        {/* <div className="space-y-2">
          <h3 className="font-semibold text-lg">Step 1: Install the AI SDK</h3>
          <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
            <code className="text-sm font-mono">npm install @vercel/ai-sdk</code>
            <ButtonCN variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </ButtonCN>
          </div>
        </div> */}

          <Tabs defaultValue="cURL" className=" flex justify-end">
            <TabsList>
              <TabsTrigger value="cURL">cURL</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="dart">Dart</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>


          {/* <h3 className="font-semibold text-lg">Step 2: Connect to your agent</h3> */}
          <div className="bg-gray-800 h-full mb-16 text-gray-100 p-4 rounded-md overflow-auto relative">
            <pre className="text-sm font-mono">
              <code>
{`curl -X GET "https://api.plutofy.live/v1/<agent-id>" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key-here" \\
  --data '{
    "person": "harshit",
    "age": 14
  }'`}
</code>
            </pre>
            <ButtonCN variant="ghost" size="sm" className="absolute bottom-2 right-2 text-gray-400 hover:text-white">
              <Copy className="h-4 w-4" />
            </ButtonCN>
          </div>
      </CardContent>
    </Card>
  )
}