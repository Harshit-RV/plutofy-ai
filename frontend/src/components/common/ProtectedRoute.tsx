import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ReactNode } from "react";

const ProtectedRoute = ({ child }: { child: ReactNode }) => {
  return (
    <>
    <SignedIn> {child} </SignedIn>

    <SignedOut> 
      <RedirectToSignIn />
    </SignedOut>
    </>
  );
};

export default ProtectedRoute