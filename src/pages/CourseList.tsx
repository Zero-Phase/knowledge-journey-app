
import { useCourses } from '@/context/course-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const CourseList = () => {
  const { courses, loading } = useCourses();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <Button onClick={() => navigate('/courses/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Course
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">No courses match your search</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear search</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">You haven't created any courses yet</p>
              <Button onClick={() => navigate('/courses/new')}>
                <Plus className="mr-2 h-4 w-4" /> Create your first course
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => navigate(`/courses/${course.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
