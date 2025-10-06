"use client"

import { usePathname } from "next/navigation"
import Header from "./ui/header";

export const ClinetLayout = ({ children }: { children: React.ReactNode }) => {

  const pathname = usePathname();

  // hide the header for user-guide page 
  const hideHeader = pathname.startsWith("/user-guide");

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  )
}

export default ClinetLayout;

