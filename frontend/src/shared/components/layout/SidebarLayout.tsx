import React from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../sidebar/Sidebar'

interface Props{
    children: React.ReactNode
}

const SidebarLayout = ({children}:Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      {children}
    </SidebarProvider>
  )
}

export default SidebarLayout