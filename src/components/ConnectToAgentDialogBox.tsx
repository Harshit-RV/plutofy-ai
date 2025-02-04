import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ButtonCN } from "@/components/ui/buttoncn"
import { ConnectCard } from "@/pages/Success"


export const ConnectToAgentDialogBox = () => {
  return (
    <Dialog>
      <DialogTrigger onClick={(event) => event.stopPropagation()}>
        <ButtonCN variant={'default'} size={'sm'} className="h-8 px-4">Connect</ButtonCN>
      </DialogTrigger>
      <DialogContent className="p-0">
            {/* This action cannot be undone. This will permanently delete your account
            and remove your data from our servers. */}
          <ConnectCard />
      </DialogContent>
    </Dialog>
  )
}