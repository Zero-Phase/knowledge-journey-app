
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
      setOpenMobile(false);
    }
    navigate(path);
  };
  
  const getNavClass = (isActive: boolean) => {
    return isActive 
      ? "bg-primary/10 text-primary font-medium w-full" 
      : "hover:bg-muted/50 w-full";
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Header with app logo and sidebar toggle */}
        <div className={`flex items-center p-3 border-b ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {isCollapsed ? (
            // When collapsed, show only the app logo centered
            <div className="flex items-center justify-center w-full">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          ) : (
            // When expanded, show logo and toggle button
            <>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold text-lg">StudyTracker</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="h-8 w-8 hover:bg-muted/50"
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-2">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleNavLinkClick("/dashboard")}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors ${getNavClass(location.pathname === "/dashboard")}`}
              >
                <ListTodo className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>Dashboard</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleNavLinkClick("/courses")}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors ${getNavClass(location.pathname === "/courses")}`}
              >
                <Folder className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>My Courses</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleNavLinkClick("/courses/new")}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors ${getNavClass(location.pathname === "/courses/new")}`}
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>New Course</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleNavLinkClick("/calendar")}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors ${getNavClass(location.pathname === "/calendar")}`}
              >
                <Calendar className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>Calendar</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleNavLinkClick("/activities")}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors ${getNavClass(location.pathname === "/activities")}`}
              >
                <Activity className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>Activities</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleNavLinkClick("/profile")}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors ${getNavClass(location.pathname === "/profile")}`}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>Profile</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Close sidebar option for mobile */}
            {isMobile && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setOpenMobile(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/50 w-full"
                >
                  <PanelLeft className="h-5 w-5 flex-shrink-0" />
                  <span>Close Sidebar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>

        {/* User section at bottom */}
        {!isCollapsed && user && (
          <div className="p-3 border-t">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
              </div>
              <Button 
                onClick={logout}
                variant="ghost"
                size="sm"
                className="justify-start text-sm text-muted-foreground hover:text-primary"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Collapsed user avatar */}
        {isCollapsed && user && (
          <div className="p-3 border-t flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
