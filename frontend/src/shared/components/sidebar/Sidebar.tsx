import {
  ClipboardPenLine,
  Contact,
  HousePlus,
  LayoutDashboard,
  Mailbox,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";

import { useSidebar } from "@/shared/components/ui/sidebar";

const items = [
  { title: "Tablero", url: "#", icon: LayoutDashboard },
  { title: "Contratos", url: "#", icon: ClipboardPenLine },
  { title: "Inmuebles", url: "#", icon: HousePlus },
  { title: "Contactos", url: "#", icon: Contact },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={`relative transition-all duration-300 flex flex-col w-[13rem] justify-between border-gray-200`}
    >
      <SidebarContent>
        <SidebarTrigger />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuButton className="flex items-center justify-center w-full h-full rounded-md p-0">
              <img
                src={collapsed ? "/Frame.svg" : "/Logo.svg"}
                alt=""
                className={`${
                  collapsed ? "h-8 w-8" : "h-10 w-28"
                } transition-all duration-300 my-5`}
              />
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-y-4">
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`min-h-[50px] flex items-center justify-center text-neutral-950`}
                >
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-slate-100 rounded-md flex items-center w-full h-[50px] text-base ${
                      collapsed ? "justify-center" : "justify-start ml-4"
                    }`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center justify-center w-full"
                    >
                      <span className={`inline-flex ${collapsed ? "h-6 w-6" : "h-5 w-5"}`}>
                        <item.icon className="h-full w-full text-gray-800" />
                      </span>
                      {!collapsed && (
                        <span className="text-gray-800">{item.title}</span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-5">
        <SidebarMenuItem
          className={`w-full min-h-[50px] flex items-center justify-center overflow-visible`}
        >
          <SidebarMenuButton
            asChild
            className={`hover:bg-slate-100 rounded-2xl flex items-center w-full h-full text-base ${
              collapsed ? "justify-center" : "justify-center"
            }`}
          >
            <a href="#" className="flex items-center justify-center w-full p-0">
              <span className={`inline-flex ${collapsed ? "h-6 w-6" : "h-5 w-5"}`}>
                <Mailbox className="h-full w-full text-neutral-950" />
              </span>
              {!collapsed && (
                <span className="text-neutral-950">Contáctanos</span>
              )}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <div className="border-t border-1 border-gray-200 my-4" />

        <SidebarMenuItem
          className={`w-full min-h-[50px] flex items-center justify-center overflow-visible`}
        >
          <SidebarMenuButton
            asChild
            className={`hover:bg-slate-100 rounded-2xl flex items-center w-full h-full text-base justify-center`}
          >
            <a href="#" className="flex items-center justify-center w-full">
              <span className={`inline-flex ${collapsed ? "h-7 w-7" : "h-5 w-5"}`}>
                <LogOut className="h-full w-full text-neutral-950" />
              </span>
              {!collapsed && (
                <span className="text-neutral-950">Cerrar sesión</span>
              )}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
