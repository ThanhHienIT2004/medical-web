"use client";

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { SnackbarProvider } from "notistack";

type ProvidersProps = {
  children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <SessionProvider>
      <SnackbarProvider maxSnack={3} autoHideDuration={1000} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}>
        {children}
      </SnackbarProvider>
    </SessionProvider>
  )
}

export default Providers;