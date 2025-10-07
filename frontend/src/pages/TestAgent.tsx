import { ButtonCN } from "@/components/ui/buttoncn";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChevronsUpDown, AlertCircle, Loader2 } from "lucide-react";
import { getAgentByDocId, getCompletion } from "@/utils/agent.utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JsonTable from "@/components/json-forms/JsonToTable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getJsonObject } from "@/utils/utils";
import { ConnectToAgentDialogBox } from "@/components/agents/ConnectToAgentDialogBox";
import { AGENTS_BASE_ROUTE } from "@/config";

enum TestingMode {
  DEVELOPER_MODE = "developer_mode",
  NORMAL_MODE = "normal_mode",
}

const AgentCreate = ({ isTestMode = false }: { isTestMode: boolean }) => {
  const { getToken } = useAuth();
  const { agentDocId } = useParams();
  const [input, setInput] = useState<string>('{"message": ""}');
  const [output, setOutput] = useState<string>("");
  const [testingMode, setTestingMode] = useState<TestingMode>(
    TestingMode.NORMAL_MODE,
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(
    isTestMode ? false : true,
  );
  const [responseInfo, setResponseInfo] = useState<{
    responseTime: number;
    statusCode: number;
  } | null>(null);
  const navigate = useNavigate();

  const fetchAgent = async () => {
    const token = await getToken();
    if (!token) return;
    return await getAgentByDocId({
      agentDocId: agentDocId ?? "something-random",
      token: token,
    });
  };

  const {
    data: agent,
    isLoading: agentLoading,
    isError: agentError,
  } = useQuery(`agent-${agentDocId}`, fetchAgent);

  useEffect(() => {
    setInput(
      JSON.stringify(
        {
          agentId: agent?.agentId,
          message: "",
        },
        null,
        2,
      ),
    );
  }, [agent]);

  const onClear = () => {
    setInput(
      JSON.stringify(
        {
          agentId: agent?.agentId,
          message: "",
        },
        null,
        2,
      ),
    );
    setOutput("");
    setResponseInfo(null);
  };

  const getResponse = async () => {
    setLoading(true);
    const token: string | null = await getToken();
    if (!token) return;

    const startTime = Date.now();
    const response = await getCompletion(JSON.parse(input), token);
    setResponseInfo({
      responseTime: Date.now() - startTime,
      statusCode: response.statusCode,
    });
    setOutput(JSON.stringify(response.completion, null, 2));
    setLoading(false);
  };

  const updateInputWithMessage = (message: string) => {
    try {
      const json = JSON.parse(input);
      json.message = message;
      setInput(JSON.stringify({ ...json }));
    } catch (error) {
      console.error("Invalid JSON input:", error);
      return input;
    }
  };

  const pagePadding = "px-3 sm:px-10 md:px-20 xl:px-40";

  if (agentError) {
    return (
      <div className="flex flex-col justify-center pb-[150px] items-center font-mono min-h-screen bg-gray-100 dark:bg-background px-2.5 sm:px-6 md:px-10 lg:px-0">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              400 Bad Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              You're trying to access an agent that doesn't exist. Please check
              the agent ID and try again.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <ButtonCN onClick={() => navigate("/")}>Go Back</ButtonCN>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return !agentLoading || agent != undefined ? (
    <div className="flex flex-col font-mono min-h-screen bg-gray-100 dark:bg-background">
      <div
        className={`flex justify-between items-center bg-background border ${pagePadding} pt-5 w-full py-5 gap-3`}
      >
        <div className="flex flex-col w-full pr-20">
          <h2 className="w-full bg-background mx-1 my-1 sm:my-2 font-bold text-lg sm:text-xl border-none">
            {agent?.name}
          </h2>
          <p className="w-full bg-background mx-1 mt-1  text-gray-500 focus-visible:outline-gray-300 text-sm border-none">
            {agent?.description}
          </p>
        </div>
        <ConnectToAgentDialogBox agentId={agent?.agentId ?? ""} />
        <ButtonCN
          onClick={() => navigate(`/${AGENTS_BASE_ROUTE}/edit/${agentDocId}`)}
          variant={"outline"}
          className="w-[130px] sm:flex hidden border-gray-300 dark:border-gray-700"
        >
          Edit
        </ButtonCN>
      </div>

      <div
        className={`flex flex-col gap-5 flex-grow ${pagePadding} pt-4 w-full`}
      >
        <Collapsible
          open={isConfigOpen}
          onOpenChange={setIsConfigOpen}
          className="w-full rounded-xl shadow-sm border space-y-2 bg-background py-2.5 px-4"
        >
          <div className="flex items-center space-x-4 px-1">
            <h4 className="text-sm font-semibold">Agent Config</h4>
            <CollapsibleTrigger asChild>
              <ButtonCN variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </ButtonCN>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="flex flex-col lg:flex-row gap-4 px-0 lg:px-0">
            <div className="lg:w-2/3 flex-grow p-2 lg:p-4 border rounded-lg text-sm text-gray-600 dark:text-gray-400">
              {agent?.instruction}
            </div>
            <pre className="bg-gray-100 dark:bg-gray-900 border p-4 text-sm rounded-md overflow-auto">
              {JSON.stringify(
                getJsonObject(agent?.outputStructure ?? []),
                null,
                2,
              )}
            </pre>
          </CollapsibleContent>
        </Collapsible>

        <Tabs defaultValue={isTestMode ? "test" : "usage"}>
          <TabsList className="bg-gray-200 dark:bg-gray-900 border-gray-300 dark:border-gray-800 border">
            <TabsTrigger className="px-3" value="usage">
              Usage
            </TabsTrigger>
            <TabsTrigger className="px-4" value="test">
              Test
            </TabsTrigger>
            <TabsTrigger className="px-3" value="settings">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="pt-3">
            <div className="bg-background text-sm w-full flex justify-center py-10 items-center rounded-lg border">
              Coming Soon..
            </div>
          </TabsContent>
          <TabsContent value="settings" className="pt-3">
            <div className="bg-background text-sm w-full flex justify-center py-10 items-center rounded-lg border">
              Coming Soon..
            </div>
          </TabsContent>
          <TabsContent
            value="test"
            className="flex flex-col gap-7 flex-grow pt-4 w-full"
          >
            <div className="flex items-center space-x-2">
              <Switch
                id="airplane-mode"
                checked={testingMode == TestingMode.DEVELOPER_MODE}
                onCheckedChange={(val) =>
                  setTestingMode(
                    val ? TestingMode.DEVELOPER_MODE : TestingMode.NORMAL_MODE,
                  )
                }
              />
              <Label htmlFor="airplane-mode">Developer Mode</Label>
            </div>

            {testingMode == TestingMode.NORMAL_MODE ? (
              <div className="flex flex-col gap-0 mb-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-md text-gray-500 font-semibold">Input</h3>
                  <pre>
                    <Input
                      value={JSON.parse(input)["message"]}
                      onChange={(e) => updateInputWithMessage(e.target.value)}
                      placeholder="Enter message here"
                      className="drop-shadow-sm shadow-md rounded-lg py-7 px-4"
                    />
                  </pre>
                  <div className="flex justify-end gap-3 mt-2">
                    <ButtonCN variant={"outline"} size={"sm"} onClick={onClear}>
                      Clear
                    </ButtonCN>

                    <ButtonCN
                      className=""
                      disabled={loading}
                      size={"sm"}
                      onClick={getResponse}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-20" />
                      ) : (
                        <p> Get Response</p>
                      )}
                    </ButtonCN>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-md text-gray-500 font-semibold">
                    Output
                  </h3>
                  <JsonTable data={output ? JSON.parse(output) : {}} />
                </div>
              </div>
            ) : (
              <div className="w-full mb-10 flex flex-col lg:flex-row h-min gap-5 ">
                <div className="flex flex-col lg:w-1/2 gap-1">
                  <h3 className="text-md text-gray-500 font-semibold">Input</h3>
                  <pre>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="drop-shadow-none shadow-sm border-2 min-h-[230px]"
                    />
                  </pre>
                  <div className="flex justify-end gap-3 mt-2">
                    <ButtonCN variant={"outline"} size={"sm"} onClick={onClear}>
                      Clear
                    </ButtonCN>

                    <ButtonCN
                      className=""
                      disabled={loading}
                      size={"sm"}
                      onClick={getResponse}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-20" />
                      ) : (
                        <p> Get Response</p>
                      )}
                    </ButtonCN>
                  </div>
                </div>

                <div className="flex flex-col lg:w-1/2 gap-2">
                  <div className="flex items-center gap-5">
                    <h3 className="text-md text-gray-500 font-semibold">
                      Output
                    </h3>
                    {responseInfo && (
                      <div className="flex px-4 py-1 bg-background gap-5  border rounded-lg shadow-sm text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          Status:{" "}
                          <span
                            className={
                              responseInfo.statusCode == 200 ||
                              responseInfo.statusCode == 201
                                ? "text-green-600 font-bold"
                                : "text-red-600 font-bold"
                            }
                          >
                            {responseInfo.statusCode}
                          </span>
                        </p>
                        <p>
                          Time:{" "}
                          <span className={"text-green-600 font-bold"}>
                            {responseInfo.responseTime} ms
                          </span>{" "}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col-reverse gap-2 shadow-sm">
                    <pre className="bg-background border p-4 min-h-[230px] max-h-[265px] h-full text-sm rounded-md overflow-auto">
                      {output}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <Card className="w-[300px]">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Loading...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCreate;
