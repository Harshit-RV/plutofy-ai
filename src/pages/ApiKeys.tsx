"use client"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ButtonCN } from "@/components/ui/buttoncn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreOutlined } from "@ant-design/icons"
import { useQuery } from 'react-query'
import { useAuth } from "@clerk/clerk-react"
import { Skeleton } from "@/components/ui/skeleton"
import { createApiKey, deleteApiKey, getApiKeys } from "@/utils/apiKey.utils"
import toast from "react-hot-toast"
import { ApiKeyDoc } from "@/types/apiKey"
import { convertMongoTimestampToLocal } from "@/utils/convertMongoTimestampToLocal"

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
    <div className="flex justify-center font-mono min-h-screen bg-gray-100 px-2.5 sm:px-6 md:px-10">
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

          <div className="mt-3 sm:mt-7 rounded-xl border drop-shadow-sm bg-white">
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
                            <span className="font-medium text-md mb-0.5 text-gray-800">You have not created any API Key yet.</span>
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiKeys?.map((apiKey) => (
                          <TableRow>
                            <TableCell className="p-4 pl-5">
                                <span className="font-medium text-md mb-0.5 text-gray-800">{apiKey.name}</span>
                            </TableCell>
                            <TableCell className="p-4">
                                <span className="font-medium text-md mb-0.5 text-gray-800">********</span>
                            </TableCell>
                            <TableCell className="p-4">
                                <span className="font-medium text-md mb-0.5 text-gray-800">{convertMongoTimestampToLocal(apiKey.createdAt)}</span>
                            </TableCell>
                            <TableCell className="p-4">
                                <span className="font-medium text-md mb-0.5 text-gray-800">{apiKey.access}</span>
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
    </div>
  )
}

const ApiKeySkeleton = () => {
  return (
    <TableRow>
      <TableCell className="p-4 pl-5">
        <Skeleton className="w-full max-w-60 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      <TableCell className="p-4">
        <Skeleton className="w-full max-w-24 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      <TableCell className="p-2">
        <Skeleton className="w-full max-w-32 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      <TableCell className="p-2">
        <Skeleton className="w-full max-w-32 h-6 bg-gray-200"></Skeleton>
      </TableCell>
      
      <TableCell className="flex justify-end p-4 pr-4">
        <Skeleton className="w-4 h-6 bg-gray-200"></Skeleton>
      </TableCell>
    </TableRow>
  )
}

export const ApiCreateDialog = ( { getToken, refetchApiKeys } : { getToken: () => (Promise<string | null>), refetchApiKeys: () => void}) => {
  const [ generatedKey, setGeneratedKey ] = useState<ApiKeyDoc | null>(null);
  const [ name, setName ] = useState<string>('');
  
  const onClick = async () => {
    const token: string | null = await getToken();
    if (!token) return;

    if (!name || name == '') {
      toast.error('Please enter a name for API Key');
      return;
    }

    const apiKey = await toast.promise(
      createApiKey({ name: name, token: token }),
      {
        loading: 'Creating...',
        success: <b>API Key Created</b>,
        error: <b>Could not create API key.</b>,
      }
    );
    setGeneratedKey(apiKey);
    refetchApiKeys();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
          <ButtonCN className="px-6 sm:px-8 h-9">Create</ButtonCN>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription className="pt-1.5">
            Create an API key to access your agents.
          </DialogDescription>
        </DialogHeader>
          <div className="flex flex-col gap-6 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            { generatedKey && (
              <div className="flex w-full">
                <div className="flex items-center border-[#FA824C] gap-3 border-2 p-2 px-4 rounded-md">
                  <p className="text-nowrap no-scrollbar overflow-scroll w-full">{generatedKey.secretKey}</p>
                  
                  <div>
                    <ButtonCN 
                      variant={'outline'} 
                      className="border-2" 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedKey.secretKey);
                        toast.success('Copied to clipboard');
                      }}
                    >Copy</ButtonCN>
                  </div>
                </div>
                
              </div>
            )}
          </div>
        <DialogFooter>
          {
            generatedKey ? (
              <DialogClose>
                <ButtonCN onClick={() => {
                  setGeneratedKey(null);
                  setName('');
                }} className="px-6" variant={'outline'}>Done</ButtonCN>
              </DialogClose>
            ) : (
              <ButtonCN onClick={onClick}>Generate</ButtonCN>
            )
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}