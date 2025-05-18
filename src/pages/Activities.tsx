
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "@/context/course-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format, addDays } from "date-fns";
import { Activity, Course, Subject } from "@/types";
import { Calendar as CalendarIcon, Plus, Check, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock activities data
const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Study Linear Algebra",
    description: "Complete exercises 1-10 from chapter 3",
    subjectId: "math-101",
    subjectName: "Mathematics",
    courseId: "course-1",
    courseName: "Engineering Fundamentals",
    startDate: new Date(2025, 4, 19, 14, 0).toISOString(),
    endDate: new Date(2025, 4, 19, 16, 0).toISOString(),
    durationInMinutes: 120,
    completed: false,
    priority: "high",
    tags: ["math", "algebra", "homework"],
    createdAt: new Date(2025, 4, 15).toISOString()
  },
  {
    id: "2",
    title: "Read Physics Textbook",
    description: "Chapters 5-7 on Thermodynamics",
    subjectId: "phys-101",
    subjectName: "Physics",
    courseId: "course-1",
    courseName: "Engineering Fundamentals",
    startDate: new Date(2025, 4, 20, 10, 0).toISOString(),
    endDate: new Date(2025, 4, 20, 12, 0).toISOString(),
    durationInMinutes: 120,
    completed: true,
    priority: "medium",
    tags: ["physics", "reading"],
    createdAt: new Date(2025, 4, 15).toISOString()
  },
  {
    id: "3",
    title: "Programming Project",
    description: "Complete the sorting algorithm implementation",
    subjectId: "cs-101",
    subjectName: "Computer Science",
    courseId: "course-2",
    courseName: "Introduction to Programming",
    startDate: new Date(2025, 4, 21, 13, 0).toISOString(),
    endDate: new Date(2025, 4, 21, 17, 0).toISOString(),
    durationInMinutes: 240,
    completed: false,
    priority: "medium",
    tags: ["programming", "project"],
    createdAt: new Date(2025, 4, 16).toISOString()
  }
];

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const { courses } = useCourses();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("upcoming");
  
  // Form state for new activity
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    title: "",
    description: "",
    courseId: "",
    subjectId: "",
    startDate: new Date().toISOString(),
    endDate: addDays(new Date(), 1).toISOString(),
    priority: "medium",
    tags: [],
    completed: false
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [tempTag, setTempTag] = useState("");
  
  // Helper functions
  const formatDateForDisplay = (date: string) => {
    return format(new Date(date), "MMMM dd, yyyy 'at' h:mm a");
  };

  const formatTimeForDisplay = (date: string) => {
    return format(new Date(date), "h:mm a");
  };
  
  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setSelectedCourse(course || null);
    setNewActivity({
      ...newActivity,
      courseId,
      courseName: course?.name,
      subjectId: "",
      subjectName: ""
    });
  };
  
  const handleSubjectChange = (subjectId: string) => {
    if (!selectedCourse) return;
    
    const subject = selectedCourse.subjects.find(s => s.id === subjectId);
    setNewActivity({
      ...newActivity,
      subjectId,
      subjectName: subject?.name
    });
  };
  
  const handleAddTag = () => {
    if (tempTag && !newActivity.tags?.includes(tempTag)) {
      setNewActivity({
        ...newActivity,
        tags: [...(newActivity.tags || []), tempTag]
      });
      setTempTag("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setNewActivity({
      ...newActivity,
      tags: newActivity.tags?.filter(t => t !== tag)
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const handleCreateActivity = () => {
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      title: newActivity.title || "Untitled Activity",
      description: newActivity.description || "",
      subjectId: newActivity.subjectId || "",
      subjectName: newActivity.subjectName || "",
      courseId: newActivity.courseId || "",
      courseName: newActivity.courseName || "",
      startDate: newActivity.startDate || new Date().toISOString(),
      endDate: newActivity.endDate || addDays(new Date(), 1).toISOString(),
      durationInMinutes: 60, // Default
      completed: false,
      priority: newActivity.priority as 'low' | 'medium' | 'high',
      tags: newActivity.tags || [],
      createdAt: new Date().toISOString()
    };
    
    setActivities([...activities, activity]);
    
    // Reset form
    setNewActivity({
      title: "",
      description: "",
      courseId: "",
      subjectId: "",
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 1).toISOString(),
      priority: "medium",
      tags: [],
      completed: false
    });
    setSelectedCourse(null);
    setTempTag("");
  };
  
  const toggleActivityComplete = (activityId: string) => {
    setActivities(
      activities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };
  
  // Filter activities based on selected tab
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.startDate);
    
    switch (selectedTab) {
      case "upcoming":
        return !activity.completed && activityDate >= new Date();
      case "completed":
        return activity.completed;
      case "all":
        return true;
      default:
        return true;
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
              <DialogDescription>
                Plan your study activities and track your progress
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Activity Title</Label>
                <Input 
                  id="title"
                  value={newActivity.title}
                  onChange={e => setNewActivity({...newActivity, title: e.target.value})}
                  placeholder="E.g., Read Chapter 5"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description"
                  value={newActivity.description}
                  onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                  placeholder="Add details about your activity"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Course</Label>
                <Select 
                  value={newActivity.courseId} 
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCourse && (
                <div className="grid gap-2">
                  <Label>Subject</Label>
                  <Select 
                    value={newActivity.subjectId} 
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCourse.subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select 
                    defaultValue="medium" 
                    onValueChange={(value) => setNewActivity({...newActivity, priority: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add tag"
                    value={tempTag}
                    onChange={e => setTempTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {newActivity.tags && newActivity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newActivity.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          className="ml-2 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleCreateActivity}>Create Activity</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming" className="mb-6" onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Activities</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <Card key={activity.id} className="overflow-hidden flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-2">{activity.title}</CardTitle>
                      <CardDescription>
                        {activity.courseName} • {activity.subjectName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        checked={activity.completed}
                        onCheckedChange={() => toggleActivityComplete(activity.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {activity.description && (
                    <p className="text-sm mb-4 line-clamp-3">{activity.description}</p>
                  )}
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>{format(new Date(activity.startDate), "PPP")}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>
                        {formatTimeForDisplay(activity.startDate)} - {formatTimeForDisplay(activity.endDate)}
                      </span>
                    </div>
                    
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="flex items-start gap-1">
                        <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {activity.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex justify-between w-full">
                    <Badge
                      className={cn(
                        "capitalize",
                        activity.priority === "high" && "bg-red-500",
                        activity.priority === "medium" && "bg-amber-500",
                        activity.priority === "low" && "bg-green-500"
                      )}
                    >
                      {activity.priority} priority
                    </Badge>
                    {activity.completed ? (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <Check className="mr-1 h-3 w-3" /> Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">In progress</Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center">
              <p className="text-muted-foreground">No activities found</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default Activities;
