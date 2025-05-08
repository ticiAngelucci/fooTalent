import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className='ml-5'/>
      <Outlet />
    </SidebarProvider>
  )
}

export default SidebarLayout