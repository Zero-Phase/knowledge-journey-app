
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
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

      // Check if user exists in localStorage (for demo purposes)
      const usersData = localStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        // Password matches, login successful
        const mockUser: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
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
        // This is a mock implementation - in a real app, this would call an API
        const usersData = localStorage.getItem("users");
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
          password
        };
        
        // Store the new user
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        
        // Log the user in
        const mockUser: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        // Initialize empty courses data for the new user
        const userCoursesKey = `courses_${newUser.id}`;
        localStorage.setItem(userCoursesKey, JSON.stringify([]));
        
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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
