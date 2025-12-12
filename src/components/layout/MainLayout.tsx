import { ReactNode } from 'react';
import { Sidebar, SidebarContent } from './Sidebar';
import { Header } from './Header';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="md:ml-64 transition-all duration-300 ease-in-out flex flex-col min-h-screen">
        <Header
          title={title}
          subtitle={subtitle}
          mobileTrigger={
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-3">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-r border-sidebar-border">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
          }
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
