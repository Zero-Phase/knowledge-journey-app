
import { useCourses } from '@/context/course-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';

const Calendar = () => {
  const { courses } = useCourses();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // Get courses with deadlines
  const coursesWithDeadlines = courses.map(course => ({
    ...course,
    deadlineDate: new Date(course.deadline)
  }));

  // Filter courses for the selected date
  const coursesForSelectedDate = coursesWithDeadlines.filter(course => 
    isSameDay(course.deadlineDate, date)
  );

  const today = new Date();

  // Create an array of dates that have deadlines
  const daysWithCourses = coursesWithDeadlines.map(course => course.deadlineDate);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Calendar</h1>
      
      <div className="grid lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{format(month, 'MMMM yyyy')}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newMonth = new Date(month);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setMonth(newMonth);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newMonth = new Date(month);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setMonth(newMonth);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
              modifiers={{
                deadline: daysWithCourses
              }}
              modifiersStyles={{
                deadline: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  borderRadius: '0.25rem'
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {format(date, 'MMMM d, yyyy')}
            </h2>
            
            {coursesForSelectedDate.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">
                  No deadlines on this date
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-medium">
                  {coursesForSelectedDate.length} {coursesForSelectedDate.length === 1 ? 'course' : 'courses'} due
                </p>
                
                <div className="space-y-3">
                  {coursesForSelectedDate.map(course => (
                    <div 
                      key={course.id}
                      className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="font-medium">{course.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">Progress: {course.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
