
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useCourses } from '@/context/course-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CourseCard from '@/components/CourseCard';
import ProgressRing from '@/components/ProgressRing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, ArrowUp, ListCheck, Book } from 'lucide-react';
import { format, isBefore, addDays } from 'date-fns';

const Dashboard = () => {
  const { courses, loading } = useCourses();
  const navigate = useNavigate();

  // Calculate overall progress across all courses
  const overallProgress = courses.length 
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length) 
    : 0;

  // Sort courses by deadline (most recent first)
  const sortedCourses = [...courses].sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );
  
  // Get upcoming deadlines (next 7 days)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  const upcomingDeadlines = sortedCourses
    .filter(course => {
      const deadline = new Date(course.deadline);
      return isBefore(deadline, nextWeek) && !isBefore(deadline, today);
    })
    .slice(0, 3);
    
  // Get courses that need attention (low progress but deadline approaching)
  const needsAttention = sortedCourses
    .filter(course => {
      const deadline = new Date(course.deadline);
      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return course.progress < 50 && daysLeft < 14 && daysLeft > 0;
    })
    .slice(0, 3);

  // Get recent course activity
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => navigate('/courses/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Course
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-dashed border-2 p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Book className="h-12 w-12 text-muted-foreground" />
            <CardTitle>No courses yet</CardTitle>
            <CardDescription>Create your first course to start tracking your progress</CardDescription>
            <Button onClick={() => navigate('/courses/new')}>
              <Plus className="mr-2 h-4 w-4" /> New Course
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {courses.reduce((acc, course) => acc + course.subjects.length, 0)} subjects
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <ArrowUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <ProgressRing progress={overallProgress} size={60} strokeWidth={6} />
                <div>
                  <div className="text-2xl font-bold">{overallProgress}%</div>
                  <p className="text-xs text-muted-foreground">
                    {overallProgress >= 75
                      ? "Excellent progress!"
                      : overallProgress >= 50
                      ? "Good progress"
                      : "Keep going!"}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadline</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold">
                      {format(new Date(upcomingDeadlines[0].deadline), "MMM dd")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {upcomingDeadlines[0].name}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-medium">No upcoming</div>
                    <p className="text-xs text-muted-foreground">
                      All deadlines are far away
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                <ListCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {needsAttention.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {needsAttention.length > 0
                    ? "Courses need your attention"
                    : "All courses on track"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Course Tabs */}
          <Tabs defaultValue="recent">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Deadlines</TabsTrigger>
              <TabsTrigger value="attention">Needs Attention</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentCourses.length > 0 ? (
                  recentCourses.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onClick={() => navigate(`/courses/${course.id}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-muted-foreground">
                    No recent courses found
                  </div>
                )}
              </div>
              
              {courses.length > 3 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => navigate('/courses')}>
                    View All Courses
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course}
                      onClick={() => navigate(`/courses/${course.id}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-muted-foreground">
                    No upcoming deadlines in the next week
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="attention" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {needsAttention.length > 0 ? (
                  needsAttention.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course}
                      onClick={() => navigate(`/courses/${course.id}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-muted-foreground">
                    All courses are on track! Good job!
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
