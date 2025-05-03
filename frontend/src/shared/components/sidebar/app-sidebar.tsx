import {
  ClipboardPenLine,
  Contact,
  HousePlus,
  LayoutDashboard,
  Facebook,
  Instagram,
  Mailbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

const items = [
  { title: "Tablero", url: "#", icon: LayoutDashboard },
  { title: "Contratos", url: "#", icon: ClipboardPenLine },
  { title: "Inmuebles", url: "#", icon: HousePlus },
  { title: "Contactos", url: "#", icon: Contact },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      className={`${
        collapsed ? "w-[80px]" : "w-[200px]"
      } transition-all duration-300 flex flex-col justify-between pt-[40px] bg-black`}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuButton className="flex items-center justify-center w-full h-10 bg-zinc-900 text-white rounded-md mx-auto">
              Logo
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-[140px] gap-y-16">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-y-4">
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`m-auto ${
                    collapsed ? "w-[64px]" : "w-[156px]"
                  } h-[40px] flex items-center justify-center`}
                >
                  <SidebarMenuButton
                    asChild
                    className="bg-zinc-900 hover:bg-slate-200  rounded-md flex items-center justify-center w-full h-full"
                  >
                    <a
                      href={item.url}
                      className="hover:text-black flex items-center justify-center gap-2 w-full h-full"
                    >
                      <item.icon size={18} className="hover:text-black text-white" />
                      {!collapsed && (
                        <span className="hover:text-black text-white">{item.title}</span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent className="flex justify-center mt-4">
            {collapsed ? (
              <SidebarMenuButton
                onClick={() => setCollapsed(!collapsed)}
                className="text-black hover:bg-white rounded-full w-[40px] h-[40px] flex items-center justify-center bg-white mt-[100px]"
              >
                {collapsed ? (
                  <ChevronRight className="text-black" />
                ) : (
                  <ChevronLeft className="text-black" />
                )}
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                onClick={() => setCollapsed(!collapsed)}
                className="text-black hover:bg-white rounded-full w-[40px] h-[40px] flex items-center justify-center bg-white mt-[200px]"
              >
                {collapsed ? (
                  <ChevronRight className="text-black" />
                ) : (
                  <ChevronLeft className="text-black" />
                )}
              </SidebarMenuButton>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {collapsed ? (
        <SidebarFooter className="bg-zinc-500 h-[234px] rounded-[8px] flex justify-center">
          <div className="flex flex-col items-center justify-center gap-[18.79px]">
            <a href="#">
              <Facebook className="w-[32px] h-[32px] text-white" />
            </a>
            <a href="#">
              <Instagram className="w-[32px] h-[32px] text-white" />
            </a>
            <a href="#">
              <Mailbox className="w-[32px] h-[32px] text-white" />
            </a>
          </div>
        </SidebarFooter>
      ) : (
        <SidebarFooter className="bg-zinc-500 h-[108px] rounded-[8px] flex justify-center">
          <div className="flex flex-row items-center justify-center gap-[18.79px]">
            <a href="#">
              <Facebook className="w-[32px] h-[32px] text-white" />
            </a>
            <a href="#">
              <Instagram className="w-[32px] h-[32px] text-white" />
            </a>
            <a href="#">
              <Mailbox className="w-[32px] h-[32px] text-white" />
            </a>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
