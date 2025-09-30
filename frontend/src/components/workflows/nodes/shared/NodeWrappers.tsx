import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const GeneralActionNode = ({ className, children } : { className?: string , children: ReactNode}) => {
  return (
    <div className={cn("size-14 bg-white border rounded-lg flex flex-col justify-center items-center", className)}>
      {children}
    </div>
  )
}

export const GeneralTriggerNode = ({ className, children } : { className?: string , children: ReactNode}) => {
  return (
    <div className={cn("size-14 bg-white border rounded-lg flex flex-col justify-center items-center rounded-l-full", className)}>
      {children}
    </div>
  )
}

export const GeneralDependentNode = ({ className, children } : { className?: string , children: ReactNode}) => {
  return (
    <div className={cn('size-full rounded-full border p-1 bg-white', className ?? "")}>
      {children}
    </div>
  )
}
