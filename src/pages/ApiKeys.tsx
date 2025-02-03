"use client"

import { useState } from "react"
import { ButtonCN } from "@/components/ui/buttoncn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ApiKey = {
  id: string
  name: string
  createdAt: string
  lastUsed: string
  active: boolean
}

const initialApiKeys: ApiKey[] = [
  { id: "1", name: "Production API Key", createdAt: "2023-01-01", lastUsed: "2023-06-15", active: true },
  { id: "2", name: "Development API Key", createdAt: "2023-03-15", lastUsed: "2023-06-14", active: true },
  { id: "3", name: "Test API Key", createdAt: "2023-05-01", lastUsed: "2023-06-10", active: false },
]


export default function ApiKeysPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-muted-foreground mt-1">Manage your API keys for accessing the Vercel API</p>
          </div>
          {/* <CreateApiKeyButton /> */}
        </div>
        <ApiKeysList />
      </main>
    </div>
  )
}


export function ApiKeysList() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)

  const toggleApiKey = (id: string) => {
    setApiKeys((keys) => keys.map((key) => (key.id === id ? { ...key, active: !key.active } : key)))
  }

  const deleteApiKey = (id: string) => {
    setApiKeys((keys) => keys.filter((key) => key.id !== id))
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell className="font-medium">{key.name}</TableCell>
              <TableCell>{key.createdAt}</TableCell>
              <TableCell>{key.lastUsed}</TableCell>
              <TableCell>
                {/* <Switch checked={key.active} onCheckedChange={() => toggleApiKey(key.id)} /> */}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ButtonCN variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </ButtonCN>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => deleteApiKey(key.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

