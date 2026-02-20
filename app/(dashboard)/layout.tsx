"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const SIDEBAR_MENU = [
  { label: "Ana Sayfa", href: "/", icon: LayoutDashboard },
  { label: "Siparişler", href: "/siparisler", icon: Package },
  { label: "Müşteriler", href: "/musteriler", icon: Users },
  { label: "Raporlar", href: "/raporlar", icon: FileText },
  { label: "Ayarlar", href: "/ayarlar", icon: Settings },
] as const;

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex h-14 items-center gap-2 px-2">
            <Image
              src="/images/logo/default.png"
              alt="Kargomok"
              width={32}
              height={32}
              className="h-8 w-auto shrink-0"
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {SIDEBAR_MENU.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <Link href={item.href} aria-label={item.label}>
                          <Icon className="size-4" aria-hidden />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Çıkış yap">
                <Link
                  href="/api/auth/signout"
                  aria-label="Çıkış yap"
                  className="text-sidebar-foreground"
                >
                  <LogOut className="size-4" aria-hidden />
                  <span>Çıkış Yap</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header
          className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4"
          role="banner"
        >
          <SidebarTrigger aria-label="Menüyü aç/kapat" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6" role="main">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
