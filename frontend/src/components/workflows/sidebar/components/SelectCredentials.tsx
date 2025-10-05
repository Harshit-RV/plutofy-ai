import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CreateCredentialDialog from "./CreateCredentialDialog";
import { useQuery } from "react-query";
import { useAuth } from "@clerk/clerk-react";
import CredentialsService from "@/utils/credentials.util";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectCredentialsProps {
  nodeType: string,
  value: string | undefined,
  setValue: (val: string) => void
}

const SelectCredentials = ( props : SelectCredentialsProps ) => {
  const { getToken } = useAuth();
  
  const fetchList = async () => {
    const token = await getToken();
    if (!token) return;
    return await CredentialsService.getAllCredentialsByUserAndNodeType(props.nodeType, token);
  }

  const { data: credentialsList, isLoading: credentialsLoading, refetch } = useQuery(`credentials-${props.nodeType}`, fetchList);

  return (
    <Select value={props.value} onValueChange={(val) => props.setValue(val)}>
      <SelectTrigger className="w-full bg-gray-100 dark:bg-background">
        {
          credentialsLoading ? (
            <Skeleton className="w-full h-6 bg-gray-200"></Skeleton>
          ) : (
            <SelectValue placeholder="Select Credentials" />
          )
        }
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>

          {credentialsLoading && <Skeleton className="w-full h-6 bg-gray-200"></Skeleton>}

          {
            credentialsList?.map((item, index) => (
              <SelectItem key={index} value={item._id as string}>{item.name}</SelectItem>
            ))
          }

          <CreateCredentialDialog nodeType={props.nodeType ?? ""} refetch={refetch}/>

        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectCredentials;