
import React, { createContext, useContext, useState, useEffect } from "react";
import { Course, Subject, Chapter, Topic, Subtopic } from "@/types";
import { useAuth } from "./auth-context";
import { toast } from "sonner";

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, "id" | "subjects" | "progress" | "createdAt">) => void;
  updateCourse: (courseId: string, courseData: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addSubject: (courseId: string, subject: Omit<Subject, "id" | "chapters" | "progress">) => void;
  updateSubject: (courseId: string, subjectId: string, subjectData: Partial<Subject>) => void;
  deleteSubject: (courseId: string, subjectId: string) => void;
  addChapter: (courseId: string, subjectId: string, chapter: Omit<Chapter, "id" | "topics" | "progress">) => void;
  updateChapter: (courseId: string, subjectId: string, chapterId: string, chapterData: Partial<Chapter>) => void;
  deleteChapter: (courseId: string, subjectId: string, chapterId: string) => void;
  addTopic: (courseId: string, subjectId: string, chapterId: string, topic: Omit<Topic, "id" | "subtopics" | "completed">) => void;
  updateTopic: (courseId: string, subjectId: string, chapterId: string, topicId: string, completed: boolean) => void;
  deleteTopic: (courseId: string, subjectId: string, chapterId: string, topicId: string) => void;
  addSubtopic: (courseId: string, subjectId: string, chapterId: string, topicId: string, subtopic: Omit<Subtopic, "id" | "completed">) => void;
  updateSubtopic: (courseId: string, subjectId: string, chapterId: string, topicId: string, subtopicId: string, completed: boolean) => void;
  deleteSubtopic: (courseId: string, subjectId: string, chapterId: string, topicId: string, subtopicId: string) => void;
  loading: boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Load courses from localStorage
  useEffect(() => {
    if (user) {
      loadCourses();
    } else {
      setCourses([]);
      setLoading(false);
    }
  }, [user]);

  const loadCourses = () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userCoursesKey = `courses_${user.id}`;
      const storedCourses = localStorage.getItem(userCoursesKey);
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      } else {
        localStorage.setItem(userCoursesKey, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCourses = (updatedCourses: Course[]) => {
    if (!user) return;
    
    try {
      const userCoursesKey = `courses_${user.id}`;
      localStorage.setItem(userCoursesKey, JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error saving courses:", error);
    }
  };

  const calculateCourseProgress = (course: Course): number => {
    if (!course.subjects.length) return 0;
    
    const subjectProgressSum = course.subjects.reduce((sum, subject) => sum + subject.progress, 0);
    return Math.round(subjectProgressSum / course.subjects.length);
  };

  const calculateSubjectProgress = (subject: Subject): number => {
    if (!subject.chapters.length) return 0;
    
    const chapterProgressSum = subject.chapters.reduce((sum, chapter) => sum + chapter.progress, 0);
    return Math.round(chapterProgressSum / subject.chapters.length);
  };

  const calculateChapterProgress = (chapter: Chapter): number => {
    if (!chapter.topics.length) return 0;
    
    const completedTopics = chapter.topics.filter(topic => 
      topic.completed || 
      (topic.subtopics.length > 0 && topic.subtopics.every(subtopic => subtopic.completed))
    ).length;
    
    return Math.round((completedTopics / chapter.topics.length) * 100);
  };

  // Course CRUD operations
  const addCourse = (courseData: Omit<Course, "id" | "subjects" | "progress" | "createdAt">) => {
    try {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        subjects: [],
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedCourses = [...courses, newCourse];
      saveCourses(updatedCourses);
      toast.success("Course created successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to create course");
    }
  };

  const updateCourse = (courseId: string, courseData: Partial<Course>) => {
    try {
      const updatedCourses = courses.map(course => 
        course.id === courseId 
          ? { ...course, ...courseData } 
          : course
      );
      saveCourses(updatedCourses);
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const deleteCourse = (courseId: string) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      saveCourses(updatedCourses);
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  // Subject CRUD operations
  const addSubject = (courseId: string, subjectData: Omit<Subject, "id" | "chapters" | "progress">) => {
    try {
      const newSubject: Subject = {
        ...subjectData,
        id: Date.now().toString(),
        chapters: [],
        progress: 0
      };
      
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = [...course.subjects, newSubject];
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Subject added successfully!");
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject");
    }
  };

  const updateSubject = (courseId: string, subjectId: string, subjectData: Partial<Subject>) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => 
            subject.id === subjectId 
              ? { ...subject, ...subjectData } 
              : subject
          );
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Subject updated successfully!");
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Failed to update subject");
    }
  };

  const deleteSubject = (courseId: string, subjectId: string) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.filter(subject => subject.id !== subjectId);
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Subject deleted successfully!");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    }
  };

  // Chapter CRUD operations
  const addChapter = (courseId: string, subjectId: string, chapterData: Omit<Chapter, "id" | "topics" | "progress">) => {
    try {
      const newChapter: Chapter = {
        ...chapterData,
        id: Date.now().toString(),
        topics: [],
        progress: 0
      };
      
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = [...subject.chapters, newChapter];
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Chapter added successfully!");
    } catch (error) {
      console.error("Error adding chapter:", error);
      toast.error("Failed to add chapter");
    }
  };

  const updateChapter = (courseId: string, subjectId: string, chapterId: string, chapterData: Partial<Chapter>) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => 
                chapter.id === chapterId 
                  ? { ...chapter, ...chapterData } 
                  : chapter
              );
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Chapter updated successfully!");
    } catch (error) {
      console.error("Error updating chapter:", error);
      toast.error("Failed to update chapter");
    }
  };

  const deleteChapter = (courseId: string, subjectId: string, chapterId: string) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.filter(chapter => chapter.id !== chapterId);
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Chapter deleted successfully!");
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Failed to delete chapter");
    }
  };

  // Topic CRUD operations
  const addTopic = (courseId: string, subjectId: string, chapterId: string, topicData: Omit<Topic, "id" | "subtopics" | "completed">) => {
    try {
      const newTopic: Topic = {
        ...topicData,
        id: Date.now().toString(),
        subtopics: [],
        completed: false
      };
      
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => {
                if (chapter.id === chapterId) {
                  const updatedTopics = [...chapter.topics, newTopic];
                  return { 
                    ...chapter, 
                    topics: updatedTopics,
                    progress: calculateChapterProgress({...chapter, topics: updatedTopics})
                  };
                }
                return chapter;
              });
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Topic added successfully!");
    } catch (error) {
      console.error("Error adding topic:", error);
      toast.error("Failed to add topic");
    }
  };

  const updateTopic = (courseId: string, subjectId: string, chapterId: string, topicId: string, completed: boolean) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => {
                if (chapter.id === chapterId) {
                  const updatedTopics = chapter.topics.map(topic => 
                    topic.id === topicId 
                      ? { ...topic, completed } 
                      : topic
                  );
                  
                  return { 
                    ...chapter, 
                    topics: updatedTopics,
                    progress: calculateChapterProgress({...chapter, topics: updatedTopics})
                  };
                }
                return chapter;
              });
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Topic status updated!");
    } catch (error) {
      console.error("Error updating topic:", error);
      toast.error("Failed to update topic");
    }
  };

  const deleteTopic = (courseId: string, subjectId: string, chapterId: string, topicId: string) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => {
                if (chapter.id === chapterId) {
                  const updatedTopics = chapter.topics.filter(topic => topic.id !== topicId);
                  return { 
                    ...chapter, 
                    topics: updatedTopics,
                    progress: calculateChapterProgress({...chapter, topics: updatedTopics})
                  };
                }
                return chapter;
              });
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Topic deleted successfully!");
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Failed to delete topic");
    }
  };

  // Subtopic CRUD operations
  const addSubtopic = (courseId: string, subjectId: string, chapterId: string, topicId: string, subtopicData: Omit<Subtopic, "id" | "completed">) => {
    try {
      const newSubtopic: Subtopic = {
        ...subtopicData,
        id: Date.now().toString(),
        completed: false
      };
      
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => {
                if (chapter.id === chapterId) {
                  const updatedTopics = chapter.topics.map(topic => {
                    if (topic.id === topicId) {
                      return {
                        ...topic,
                        subtopics: [...topic.subtopics, newSubtopic]
                      };
                    }
                    return topic;
                  });
                  
                  return { 
                    ...chapter, 
                    topics: updatedTopics,
                    progress: calculateChapterProgress({...chapter, topics: updatedTopics})
                  };
                }
                return chapter;
              });
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Subtopic added successfully!");
    } catch (error) {
      console.error("Error adding subtopic:", error);
      toast.error("Failed to add subtopic");
    }
  };

  const updateSubtopic = (courseId: string, subjectId: string, chapterId: string, topicId: string, subtopicId: string, completed: boolean) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => {
                if (chapter.id === chapterId) {
                  const updatedTopics = chapter.topics.map(topic => {
                    if (topic.id === topicId) {
                      const updatedSubtopics = topic.subtopics.map(subtopic => 
                        subtopic.id === subtopicId 
                          ? { ...subtopic, completed } 
                          : subtopic
                      );
                      
                      // If all subtopics are completed, mark the topic as completed as well
                      const allSubtopicsCompleted = updatedSubtopics.length > 0 && 
                        updatedSubtopics.every(subtopic => subtopic.completed);
                      
                      return {
                        ...topic,
                        subtopics: updatedSubtopics,
                        completed: allSubtopicsCompleted
                      };
                    }
                    return topic;
                  });
                  
                  return { 
                    ...chapter, 
                    topics: updatedTopics,
                    progress: calculateChapterProgress({...chapter, topics: updatedTopics})
                  };
                }
                return chapter;
              });
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Subtopic status updated!");
    } catch (error) {
      console.error("Error updating subtopic:", error);
      toast.error("Failed to update subtopic");
    }
  };

  const deleteSubtopic = (courseId: string, subjectId: string, chapterId: string, topicId: string, subtopicId: string) => {
    try {
      const updatedCourses = courses.map(course => {
        if (course.id === courseId) {
          const updatedSubjects = course.subjects.map(subject => {
            if (subject.id === subjectId) {
              const updatedChapters = subject.chapters.map(chapter => {
                if (chapter.id === chapterId) {
                  const updatedTopics = chapter.topics.map(topic => {
                    if (topic.id === topicId) {
                      const updatedSubtopics = topic.subtopics.filter(subtopic => subtopic.id !== subtopicId);
                      
                      const allSubtopicsCompleted = updatedSubtopics.length > 0 && 
                        updatedSubtopics.every(subtopic => subtopic.completed);
                      
                      return {
                        ...topic,
                        subtopics: updatedSubtopics,
                        completed: allSubtopicsCompleted
                      };
                    }
                    return topic;
                  });
                  
                  return { 
                    ...chapter, 
                    topics: updatedTopics,
                    progress: calculateChapterProgress({...chapter, topics: updatedTopics})
                  };
                }
                return chapter;
              });
              
              return { 
                ...subject, 
                chapters: updatedChapters,
                progress: calculateSubjectProgress({...subject, chapters: updatedChapters})
              };
            }
            return subject;
          });
          
          return { 
            ...course, 
            subjects: updatedSubjects,
            progress: calculateCourseProgress({...course, subjects: updatedSubjects})
          };
        }
        return course;
      });
      
      saveCourses(updatedCourses);
      toast.success("Subtopic deleted successfully!");
    } catch (error) {
      console.error("Error deleting subtopic:", error);
      toast.error("Failed to delete subtopic");
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        addSubject,
        updateSubject,
        deleteSubject,
        addChapter,
        updateChapter,
        deleteChapter,
        addTopic,
        updateTopic,
        deleteTopic,
        addSubtopic,
        updateSubtopic,
        deleteSubtopic,
        loading
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};
