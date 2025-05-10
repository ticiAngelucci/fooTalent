import { ChevronLeft } from "lucide-react"
import { AppSidebar } from "../../sidebar/Sidebar"
import { Button } from "../../ui/button"
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar"
import { useNavigate } from "react-router-dom"
import UserAvatar from "../../UserAvatar/UserAvatar"

interface LayoutProps{
    title?: string;
    subtitle?: string;
    redirect?: string;
    children: React.ReactNode;
}

const DashboardLayout = ({title, subtitle, redirect, children}: LayoutProps) => {
    const navigate = useNavigate();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-neutral-50">
                <AppSidebar />
                <div className="flex flex-col gap-6 w-full">
                    <header className="h-14 w-full px-7 bg-white flex items-center justify-between border-b" role="banner">
                        <SidebarTrigger />
                        <UserAvatar />
                    </header>
                    <div className="flex gap-4 mx-8 pb-4 items-center font-semibold text-5xl border-b">
                        {redirect &&(
                        <Button onClick={()=> navigate(redirect)} className="size-10 !p-0 bg-white text-black">
                            <ChevronLeft className="p-0 size-6" />
                        </Button>
                        )}
                        {title? <h1 className="!text-5xl">{title}</h1> : <h2 className="text-4xl">{subtitle}</h2>}
                    </div>
                    <main className="flex flex-col ml-5 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout