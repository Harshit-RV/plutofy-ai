import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreOutlined } from "@ant-design/icons"
import { useQuery } from 'react-query'
import { useAuth } from "@clerk/clerk-react"
import { deleteApiKey, getApiKeys } from "@/utils/apiKey.utils"
import toast from "react-hot-toast"
import { convertMongoTimestampToLocal } from "@/utils/convertMongoTimestampToLocal"
import PageWrapper from "@/components/common/PageWrapper"
import ApiCreateDialog from "@/components/api-keys/ApiCreateDialog"
import ApiKeySkeleton from "@/components/api-keys/ApiKeySkeleton"
import { ReactNode } from "react"

export default function ApiKeysPage() {
  const { getToken } = useAuth();

  const fetchList = async () => {
      const token = await getToken();
      if (!token) return;
      return await getApiKeys(token);
  }

  const onDelete = async ( apiKeyId: string) => {
      const token = await getToken();
      if (!token) return;

      await toast.promise(
          deleteApiKey({ apiKeyId: apiKeyId, token: token }),
            {
              loading: 'Deleting...',
              success: <b>API Key Deleted</b>,
              error: <b>Could not delete API Key.</b>,
            }
          );

      refetchApiKeys();
  }

  const { data: apiKeys, isLoading: apiKeysLoading, refetch: refetchApiKeys } = useQuery('apiKeys', fetchList);

  return (
    <PageWrapper>
        <div className="py-8 flex flex-col gap-2 sm:py-12 w-full lg:w-[1100px]">

          <div className="flex justify-between h-8 px-2 items-center">
              <div className="flex flex-col gap-0.5">
                <h1 className="font-black text-[21px] sm:text-xl font-poppins">API Keys</h1>
                <p className="hidden sm:flex text-gray-400 text-muted-foreground text-sm mt-1.5">Manage your API keys for accessing your agents</p>
              </div>
              <div className="flex gap-5">
                <ApiCreateDialog getToken={getToken} refetchApiKeys={refetchApiKeys} />
              </div>
          </div>

          <div className="mt-3 sm:mt-7 rounded-xl border drop-shadow-sm bg-background">
            <Table className='rounded-lg'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs text-nowrap min-w-40">Name</TableHead>
                        <TableHead className="text-xs text-nowrap">Secret Key</TableHead>
                        <TableHead className="text-xs text-nowrap">Created</TableHead>
                        <TableHead className="text-xs text-nowrap">Permissions</TableHead>
                        <TableHead className="text-right text-xs">Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  { 
                    !apiKeysLoading || apiKeys != undefined
                    ?

                      apiKeys?.length == 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="p-4 pl-5">
                            <TableTextItem>You have not created any API Key yet.</TableTextItem>
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiKeys?.map((apiKey, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 pl-5">
                                <TableTextItem>{apiKey.name}</TableTextItem>
                            </TableCell>
                            <TableCell className="p-4">
                                <TableTextItem >********</TableTextItem>
                            </TableCell>
                            <TableCell className="p-4">
                                <TableTextItem>{convertMongoTimestampToLocal(apiKey.createdAt)}</TableTextItem>
                            </TableCell>
                            <TableCell className="p-4">
                                <TableTextItem>{apiKey.access}</TableTextItem>
                            </TableCell>
                            
                            <TableCell className="text-right text-lg pr-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="text-[18px] sm:text-[20px]"><MoreOutlined/></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onDelete(String(apiKey.id))}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    : 
                    <>
                      <ApiKeySkeleton />
                      <ApiKeySkeleton />
                      <ApiKeySkeleton />
                    </>
                  }  
                 
                </TableBody>
            </Table>
          </div>
          
        </div>
    </PageWrapper>
  )
}

const TableTextItem = ( { children } : { children: ReactNode } ) => {
  return (
    <span className="font-medium text-md mb-0.5 text-gray-800 dark:text-foreground">{children}</span>
  )
}