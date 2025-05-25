
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { CourseProvider } from "./context/course-context";
import { ThemeProvider } from "./context/theme-context";

// Layouts
import AppLayout from "./components/AppLayout";
import AuthLayout from "./components/AuthLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CourseList from "./pages/CourseList";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Activities from "./pages/Activities";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <CourseProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<Landing />} />
                
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Route>
                
                {/* App Routes */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/courses/new" element={<CourseForm />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
