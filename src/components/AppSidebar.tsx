
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Calendar, BookOpen, ListTodo, Folder, Plus, Settings, Activity, PanelLeft } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state, setOpenMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part?.[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '';
  };
  
  const handleNavLinkClick = (path: string) => {
    if (isMobile) {
      setOpenMobile(false); // Close sidebar on mobile when a link is clicked
    }
    navigate(path);
  };
  
  const getNavClass = (isActive: boolean) => {
    return isActive 
      ? "bg-primary/10 text-primary font-medium w-full" 
      : "hover:bg-muted/50 w-full";
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        {/* Only show toggle button at the top, not app logo on desktop */}
        <div className={`flex items-center py-4 ${isCollapsed ? "justify-center" : "px-4 justify-between"}`}>
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-10 w-10">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          
          {/* Only show the app logo when collapsed on desktop or on mobile */}
          {(isCollapsed || isMobile) && (
            <div className="p-2 bg-primary/10 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          )}
          
          {/* Show app name when expanded on desktop */}
          {!isCollapsed && !isMobile && (
            <h1 className="text-xl font-bold">StudyTracker</h1>
          )}
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavLinkClick("/dashboard")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(location.pathname === "/dashboard")}`}
            >
              <ListTodo className="h-5 w-5" />
              {!isCollapsed && <span>Dashboard</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavLinkClick("/courses")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(location.pathname === "/courses")}`}
            >
              <Folder className="h-5 w-5" />
              {!isCollapsed && <span>My Courses</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavLinkClick("/courses/new")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(location.pathname === "/courses/new")}`}
            >
              <Plus className="h-5 w-5" />
              {!isCollapsed && <span>New Course</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavLinkClick("/calendar")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(location.pathname === "/calendar")}`}
            >
              <Calendar className="h-5 w-5" />
              {!isCollapsed && <span>Calendar</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavLinkClick("/activities")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(location.pathname === "/activities")}`}
            >
              <Activity className="h-5 w-5" />
              {!isCollapsed && <span>Activities</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavLinkClick("/profile")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getNavClass(location.pathname === "/profile")}`}
            >
              <Settings className="h-5 w-5" />
              {!isCollapsed && <span>Profile</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Add toggle sidebar option for mobile */}
          {isMobile && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => setOpenMobile(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 w-full`}
              >
                <PanelLeft className="h-5 w-5" />
                <span>Close Sidebar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        {!isCollapsed && (
          <div className="mt-auto p-4">
            {user && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium truncate">{user.name}</div>
                </div>
                <button 
                  onClick={logout}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
