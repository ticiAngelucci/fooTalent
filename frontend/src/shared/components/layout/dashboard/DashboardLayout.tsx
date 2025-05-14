import { ChevronLeft } from "lucide-react"
import { AppSidebar } from "../../sidebar/Sidebar"
import { Button } from "../../ui/button"
import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar"
import { Link, useNavigate } from "react-router-dom"
import UserAvatar from "../../UserAvatar/UserAvatar"
import { Route } from "@/shared/constants/route"

interface LayoutProps {
    title?: string;
    subtitle?: string;
    redirect?: string;
    dashBtn?: React.ReactNode;
    children: React.ReactNode;
}

const DashboardLayout = ({ title, subtitle, redirect, dashBtn, children }: LayoutProps) => {
    const navigate = useNavigate();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-neutral-50">
                <AppSidebar />
                <div className="flex flex-col gap-6 w-full">
                    <header className="h-14 w-full px-7 justify-between bg-white flex items-center border-b" role="banner">
                        <SidebarTrigger />
                        <Link to={Route.Profile}>
                            <UserAvatar />
                        </Link>
                    </header>
                    <main className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden px-8">
                        <div className="flex gap-4 w-full items-center justify-between font-semibold border-b">
                            <div className="display flex gap-4">
                                {redirect && (
                                    <Button onClick={() => navigate(redirect)} className="size-10 !p-0 btn-secondary">
                                        <ChevronLeft className="p-0 size-6" />
                                    </Button>
                                )}
                                {title ? <h1 className="!text-5xl">{title}</h1> : <h2 className="text-4xl">{subtitle}</h2>}
                            </div>
                            {dashBtn && (<>
                                {dashBtn}
                            </>)}
                        </div>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout