import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NodeWrapperProps {
  children: ReactNode
  className?: string
}

export const GeneralActionNode = ( { className, children } : NodeWrapperProps ) => {
  return (
    <div className={cn("size-14 bg-white text-black border rounded-lg flex flex-col justify-center items-center", className)}>
      {children}
    </div>
  )
}

export const GeneralTriggerNode = ({ className, children } : NodeWrapperProps ) => {
  return (
    <div className={cn("size-14 bg-white text-black border rounded-lg flex flex-col justify-center items-center rounded-l-full", className)}>
      {children}
    </div>
  )
}

export const GeneralDependentNode = ({ className, children } : NodeWrapperProps ) => {
  return (
    <div className={cn('size-full rounded-full border p-1 bg-white text-black', className ?? "")}>
      {children}
    </div>
  )
}
