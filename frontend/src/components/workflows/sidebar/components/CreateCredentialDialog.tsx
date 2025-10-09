import { ButtonCN } from "@/components/ui/buttoncn";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import workflowScheme from "@/workflow-scheme";
import { useState } from "react";
import SingleInputField from "../views/SingleInputField";
import toast from "react-hot-toast";
import CredentialsService from "@/services/credentials.service";
import { useAuth } from "@clerk/clerk-react";
import { NodeType } from "@/types/workflow";
import { Input } from "@/components/ui/input";


interface CreateCredentialDialogProps {
  nodeType: string,
  refetch: () => void
}

const CreateCredentialDialog = ( props: CreateCredentialDialogProps ) => {
  const { getToken } = useAuth();
  const nodeInfoFromScheme = workflowScheme.nodes.find(wf => wf.type == props.nodeType);
  const [ open, setOpen ] = useState(false);
  const [ name, setName ] = useState("")
  const [ localData, setLocalData ] = useState<Record<string, unknown>>({});

  const handleInputChange = (fieldName: string, value: unknown) => {
    setLocalData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const createCredential = async () => {
    const token: string | null = await getToken();
    if (!token) return;
    
    // TODO: add validation according to node type here
    await toast.promise(CredentialsService.createCredentials({
      data: localData,
      name: name,
      type: props.nodeType as NodeType
    }, token), {
      loading: "Creating credentials..",
      success: <b>Credentials Created</b>,
      error: <b>Could not create credentials.</b>,
    });

    props.refetch();
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <ButtonCN className="w-full mt-1" variant={"outline"}>Create new credentials</ButtonCN>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Credential</DialogTitle>
        </DialogHeader>
        
        <div className='mt-1'>
          <p className='text-xs mb-1'>Credentials Name (so you can uniquely identify them)</p>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {
          nodeInfoFromScheme?.credentials.map((inputField, index) => (
            <div key={index} className='mt-1'>
              <p className='text-xs mb-1'>{inputField.displayName}</p>
              <SingleInputField 
                key={`${index}-${nodeInfoFromScheme.type}-${inputField.name}`}
                type={inputField.type} 
                value={localData[inputField.name] ?? ''} 
                
                onValueChange={(val) => handleInputChange(inputField.name, val)}

                name={inputField.name} 
                displayName={inputField.displayName} 
              />
            </div>
          ))
        }

        <DialogFooter>
          <DialogClose asChild>
            <ButtonCN variant="outline">Cancel</ButtonCN>
          </DialogClose>
          <ButtonCN onClick={() => createCredential()}>Create</ButtonCN>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCredentialDialog;