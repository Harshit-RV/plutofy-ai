import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const PageWrapper = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div className={cn("flex justify-center font-mono min-h-screen bg-gray-100 dark:bg-background px-2.5 sm:px-6 md:px-10", className)}>
      {children}
    </div>
  )
}

export default PageWrapper;