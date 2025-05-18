
import { NavLink, useLocation } from "react-router-dom";
import { Calendar, BookOpen, ListTodo, Folder, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const getNavClass = (isActive: boolean) => {
    return isActive 
      ? "bg-primary/10 text-primary font-medium" 
      : "hover:bg-muted/50";
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <div className={`flex items-center justify-center py-4 ${collapsed ? "" : "px-4"}`}>
          {collapsed ? (
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              StudyTracker
            </h1>
          )}
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(isActive)}`}
              >
                <ListTodo className="h-5 w-5" />
                {!collapsed && <span>Dashboard</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/courses" 
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(isActive)}`}
              >
                <Folder className="h-5 w-5" />
                {!collapsed && <span>My Courses</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/courses/new" 
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(isActive)}`}
              >
                <Plus className="h-5 w-5" />
                {!collapsed && <span>New Course</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(isActive)}`}
              >
                <Calendar className="h-5 w-5" />
                {!collapsed && <span>Calendar</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && (
          <div className="mt-auto p-4">
            {user && (
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium">{user.name}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="w-full justify-start"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
