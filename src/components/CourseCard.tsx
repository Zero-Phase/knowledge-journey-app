
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/types";
import { Calendar, Book } from "lucide-react";
import { format } from "date-fns";

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const { name, description, deadline, subjects, progress } = course;
  
  // Calculate days left
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const formattedDeadline = format(new Date(deadline), "MMM dd, yyyy");
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center text-sm pt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Book className="h-4 w-4" />
            <span>{subjects.length} {subjects.length === 1 ? "subject" : "subjects"}</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDeadline}</span>
          </div>
        </div>
        
        {diffDays <= 7 && diffDays > 0 && (
          <div className="mt-2 text-sm font-medium text-orange-500">
            {diffDays} {diffDays === 1 ? "day" : "days"} left!
          </div>
        )}
        
        {diffDays <= 0 && (
          <div className="mt-2 text-sm font-medium text-red-500">
            Deadline passed!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseCard;
