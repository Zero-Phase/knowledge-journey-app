
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Calendar, TrendingUp, Users, CheckCircle, ArrowRight, Star, Zap, Shield } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { Moon, Sun } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const features = [
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set and achieve your academic goals with intelligent progress tracking and milestone celebrations."
    },
    {
      icon: Calendar,
      title: "Interactive Calendar",
      description: "Never miss a deadline with our beautiful calendar that syncs all your assignments and exams."
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your academic journey with detailed analytics and performance insights."
    },
    {
      icon: BookOpen,
      title: "Course Organization",
      description: "Organize all your courses in one place with easy-to-use management tools."
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with classmates and form study groups to enhance your learning experience."
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Stay on top of your studies with smart notifications and reminders."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "StudyTracker transformed my academic life! I went from struggling to maintain my schedule to becoming the most organized student in my class.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Medical Student",
      content: "The analytics feature helped me identify my weak areas and improve my study efficiency by 200%. Absolutely game-changing!",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Business Major",
      content: "I love how intuitive and beautiful the interface is. Managing multiple courses has never been this easy and enjoyable.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Header */}
      <header className="relative z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyTracker
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="font-medium text-sm px-2 sm:px-4"
              size="sm"
            >
              Sign In
            </Button>
            
            <Button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-sm px-3 sm:px-4"
              size="sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Trusted by 50,000+ students worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Master Your
              <br />
              Academic Journey
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your study habits with our intelligent tracking system. Stay organized, motivated, and achieve academic excellence like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="default"
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg group w-full sm:w-auto"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="default"
                variant="outline"
                onClick={() => navigate("/login")}
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Secure & Private
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                Instant setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help you stay organized, focused, and successful in your academic pursuits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl w-fit group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Loved by Students Everywhere
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how StudyTracker is transforming academic lives across the globe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Studies?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful students who have already elevated their academic performance with StudyTracker.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg group"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">StudyTracker</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering students to achieve academic excellence through intelligent organization.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 StudyTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
