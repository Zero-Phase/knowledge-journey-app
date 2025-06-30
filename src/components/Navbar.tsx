
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const isSidebarExpanded = state === "expanded";
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="h-16 border-b flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 transition-all duration-200 ease-in-out">
      <div className="flex items-center gap-2">
        {/* Show sidebar trigger on mobile always, on desktop only when sidebar is collapsed */}
        <SidebarTrigger className="md:hidden transition-all duration-200 ease-in-out hover:scale-105" />
        {!isSidebarExpanded && <SidebarTrigger className="hidden md:flex transition-all duration-200 ease-in-out hover:scale-105" />}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 ease-in-out hover:scale-110"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ease-in-out" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ease-in-out" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Notifications"
          className="h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 ease-in-out hover:scale-110"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ease-in-out" />
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full transition-all duration-200 ease-in-out hover:scale-110">
                <Avatar className="h-8 w-8 transition-all duration-200 ease-in-out">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 transition-all duration-200 ease-in-out">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full transition-all duration-150 ease-in-out hover:bg-muted">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="w-full transition-all duration-150 ease-in-out hover:bg-muted">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default Navbar;
