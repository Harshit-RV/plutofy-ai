import { ButtonCN } from "@/components/ui/buttoncn"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Rocket, Settings, Share2 } from "lucide-react"

export default function AIDeploymentSuccess() {
  return (
    <div className="h-full bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Deployment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">Your AI agent has been successfully deployed and is now ready to use.</p>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Agent Name:</span>
              <span className="text-sm font-semibold">SmartAssistant v1.0</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Deployment ID:</span>
              <span className="text-sm font-mono">dep_8f9z2x7y1w</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className="text-sm font-semibold text-green-600">Active</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <ButtonCN className="w-full">
            <Rocket className="mr-2 h-4 w-4" /> Launch Agent
          </ButtonCN>
          <div className="flex space-x-2 w-full">
            <ButtonCN variant="outline" className="flex-1">
              <Settings className="mr-2 h-4 w-4" /> Configure
            </ButtonCN>
            <ButtonCN variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </ButtonCN>
          </div>
        </CardFooter>
      </Card>
      <div className="h-96"></div>
    </div>
  )
}

