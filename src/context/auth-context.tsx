
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        toast.error("Please provide email and password");
        return false;
      }

      // Instead of relying on localStorage "users" which might be device-specific,
      // Use sessionStorage for demo since it simulates a server better
      const usersData = sessionStorage.getItem("users") || localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Save users to sessionStorage to simulate a shared database
      if (!sessionStorage.getItem("users")) {
        sessionStorage.setItem("users", JSON.stringify(users));
      }
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        // Password matches, login successful
        const mockUser: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          bio: foundUser.bio || "",
          phone: foundUser.phone || "",
          avatarUrl: foundUser.avatarUrl || "",
          timezone: foundUser.timezone || "UTC",
          notificationPreferences: foundUser.notificationPreferences || {
            email: true,
            push: true,
            deadlines: true,
            activities: true
          }
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        // Track device login for this user (limit to 5)
        const deviceLogins = JSON.parse(localStorage.getItem(`device_logins_${foundUser.id}`) || '[]');
        const deviceId = crypto.randomUUID(); // Generate unique device ID
        
        // Only add if not already there and under limit
        if (!deviceLogins.includes(deviceId) && deviceLogins.length < 5) {
          deviceLogins.push(deviceId);
          localStorage.setItem(`device_logins_${foundUser.id}`, JSON.stringify(deviceLogins));
        }
        
        toast.success("Logged in successfully!");
        return true;
      } else {
        // User not found or password doesn't match
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      if (name && email && password) {
        // Use sessionStorage to simulate a shared database
        const usersData = sessionStorage.getItem("users") || localStorage.getItem("users");
        const users = usersData ? JSON.parse(usersData) : [];
        
        const userExists = users.some((u: any) => u.email === email);
        
        if (userExists) {
          toast.error("User with this email already exists");
          return false;
        }
        
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          // In a real app, you'd hash the password before storing
          password,
          bio: "",
          phone: "",
          avatarUrl: "",
          timezone: "UTC",
          notificationPreferences: {
            email: true,
            push: true,
            deadlines: true,
            activities: true
          }
        };
        
        // Store the new user in both local and session storage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        sessionStorage.setItem("users", JSON.stringify(users));
        
        // Log the user in
        const mockUser: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          bio: newUser.bio,
          phone: newUser.phone,
          avatarUrl: newUser.avatarUrl,
          timezone: newUser.timezone,
          notificationPreferences: newUser.notificationPreferences
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        // Initialize empty courses data for the new user
        const userCoursesKey = `courses_${newUser.id}`;
        localStorage.setItem(userCoursesKey, JSON.stringify([]));
        
        // Track device login for this user
        const deviceId = crypto.randomUUID(); // Generate unique device ID
        localStorage.setItem(`device_logins_${newUser.id}`, JSON.stringify([deviceId]));
        
        toast.success("Account created successfully!");
        return true;
      }
      
      toast.error("Please fill in all fields");
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
      return false;
    }
  };

  const updateUserProfile = (updatedUser: Partial<User>) => {
    if (user) {
      // Update the current user state with the new data
      const newUserData = { ...user, ...updatedUser };
      setUser(newUserData);
      
      // Update the user in localStorage
      localStorage.setItem("user", JSON.stringify(newUserData));
      
      // Also update the user in the users array in both localStorage and sessionStorage
      const updateUserInStorage = (storage: Storage) => {
        const usersData = storage.getItem("users");
        if (usersData) {
          const users = JSON.parse(usersData);
          const updatedUsers = users.map((u: any) => 
            u.id === user.id ? { ...u, ...updatedUser, password: u.password } : u
          );
          storage.setItem("users", JSON.stringify(updatedUsers));
        }
      };
      
      updateUserInStorage(localStorage);
      updateUserInStorage(sessionStorage);
      
      return true;
    }
    return false;
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        toast.error("No user is currently logged in");
        return false;
      }

      // Remove user from both storages
      const removeUserFromStorage = (storage: Storage) => {
        const usersData = storage.getItem("users");
        if (usersData) {
          const users = JSON.parse(usersData);
          const updatedUsers = users.filter((u: any) => u.id !== user.id);
          storage.setItem("users", JSON.stringify(updatedUsers));
        }
      };
      
      removeUserFromStorage(localStorage);
      removeUserFromStorage(sessionStorage);

      // Clear user-specific data
      localStorage.removeItem(`courses_${user.id}`);
      localStorage.removeItem(`device_logins_${user.id}`);
      localStorage.removeItem("user");
      
      // Log out the user
      setUser(null);
      
      toast.success("Account deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("An error occurred while deleting your account");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUserProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
