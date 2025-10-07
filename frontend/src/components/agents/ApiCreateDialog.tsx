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
import { ApiKeyDoc } from "@/types/apiKey"
import toast from "react-hot-toast"
import { createApiKey } from "@/utils/apiKey.utils"

const ApiCreateDialog = ( { getToken, refetchApiKeys } : { getToken: () => (Promise<string | null>), refetchApiKeys: () => void}) => {
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
          <ButtonCN className="px-6 sm:px-8 h-9">Create API Key</ButtonCN>
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
              <Input id="name" disabled={generatedKey != null} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            { generatedKey && (
              <div className="flex max-w-full">
                <div className="flex items-center border-[#FA824C] gap-3 border-2 p-2 px-4 rounded-md">
                  <p className="no-scrollbar overflow-scroll max-w-[200px] sm:max-w-[300px] lg:max-w-[350px] w-full">{generatedKey.secretKey}</p>
                  
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

export default ApiCreateDialog;