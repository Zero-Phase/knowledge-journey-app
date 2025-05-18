
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '@/context/course-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ProgressRing from '@/components/ProgressRing';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Plus, Calendar, ArrowLeft, Trash, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Chapter, Course, Subject, Topic } from '@/types';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, addSubject, updateSubject, deleteSubject, addChapter, deleteChapter, addTopic, updateTopic, deleteTopic, addSubtopic, updateSubtopic, deleteSubtopic } = useCourses();
  
  const course = courses.find(c => c.id === courseId);

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newSubtopicName, setNewSubtopicName] = useState('');
  
  // State for the currently selected subject for adding a chapter
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState<{
    type: string;
    id: string;
    parentId?: string;
    grandParentId?: string;
    greatGrandParentId?: string;
  } | null>(null);

  if (!course) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate('/courses')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Button>
        </div>
        <div className="text-center py-16">
          <h1 className="text-2xl font-medium mb-2">Course not found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')}>
            View All Courses
          </Button>
        </div>
      </div>
    );
  }
  
  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    
    addSubject(course.id, { name: newSubjectName.trim() });
    setNewSubjectName('');
  };
  
  const handleAddChapter = (subjectId: string) => {
    if (!newChapterName.trim()) {
      toast.error("Please enter a chapter name");
      return;
    }
    
    addChapter(course.id, subjectId, { name: newChapterName.trim() });
    setNewChapterName('');
    setSelectedSubjectId(null);
  };
  
  const handleAddTopic = (subjectId: string, chapterId: string) => {
    if (!newTopicName.trim()) {
      toast.error("Please enter a topic name");
      return;
    }
    
    addTopic(course.id, subjectId, chapterId, { name: newTopicName.trim() });
    setNewTopicName('');
    setSelectedChapterId(null);
  };
  
  const handleAddSubtopic = (subjectId: string, chapterId: string, topicId: string) => {
    if (!newSubtopicName.trim()) {
      toast.error("Please enter a subtopic name");
      return;
    }
    
    addSubtopic(course.id, subjectId, chapterId, topicId, { name: newSubtopicName.trim() });
    setNewSubtopicName('');
    setSelectedTopicId(null);
  };
  
  const confirmDelete = (action: typeof confirmDialogAction) => {
    setConfirmDialogAction(action);
    setDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (!confirmDialogAction) return;
    
    const { type, id, parentId, grandParentId, greatGrandParentId } = confirmDialogAction;
    
    switch (type) {
      case 'subject':
        if (id) deleteSubject(course.id, id);
        break;
      case 'chapter':
        if (id && parentId) deleteChapter(course.id, parentId, id);
        break;
      case 'topic':
        if (id && parentId && grandParentId) deleteTopic(course.id, grandParentId, parentId, id);
        break;
      case 'subtopic':
        if (id && parentId && grandParentId && greatGrandParentId) 
          deleteSubtopic(course.id, greatGrandParentId, grandParentId, parentId, id);
        break;
    }
    
    setDialogOpen(false);
    setConfirmDialogAction(null);
  };

  const isDueWithin7Days = () => {
    const deadline = new Date(course.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 && diffDays <= 7;
  };
  
  const isPastDue = () => {
    const deadline = new Date(course.deadline);
    const today = new Date();
    return deadline < today;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/courses')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
        <div className="flex items-center gap-2">
          <ProgressRing progress={course.progress} />
          <div>
            <div className="text-lg font-medium">{course.progress}% Complete</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-4 w-4" /> 
              {format(new Date(course.deadline), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </div>
      
      {course.description && (
        <div className="mb-8">
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      )}
      
      {(isDueWithin7Days() || isPastDue()) && (
        <Alert className={`mb-8 ${isPastDue() ? 'border-red-500' : 'border-orange-500'}`}>
          {isPastDue() ? (
            <div className="flex flex-row gap-2">
              <div className="p-1 bg-red-500/20 rounded-full">
                <Calendar className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <AlertTitle className="text-red-500">Deadline passed</AlertTitle>
                <AlertDescription>This course has passed its deadline.</AlertDescription>
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-2">
              <div className="p-1 bg-orange-500/20 rounded-full">
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <AlertTitle className="text-orange-500">Deadline approaching</AlertTitle>
                <AlertDescription>This course is due within the next week.</AlertDescription>
              </div>
            </div>
          )}
        </Alert>
      )}
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Subjects</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {course.subjects.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">No subjects added to this course yet</p>
              <div className="flex items-center justify-center">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new subject"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-64"
                  />
                  <Button onClick={handleAddSubject}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="border rounded-lg overflow-hidden divide-y">
                {course.subjects.map((subject: Subject) => (
                  <Accordion 
                    type="single" 
                    collapsible 
                    key={subject.id} 
                    className="border-0 shadow-none"
                  >
                    <AccordionItem value={subject.id} className="border-0">
                      <AccordionTrigger className="hover:bg-secondary/50 px-4 py-3 hover:no-underline">
                        <div className="flex flex-1 items-center justify-between pr-4">
                          <div className="font-medium">{subject.name}</div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">
                              {subject.progress}% complete
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete({ type: 'subject', id: subject.id });
                              }}
                            >
                              <Trash className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="pl-6 pr-4 pb-4 space-y-2">
                          {subject.chapters.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              No chapters yet
                            </div>
                          ) : (
                            subject.chapters.map((chapter: Chapter) => (
                              <Accordion 
                                type="single" 
                                collapsible 
                                key={chapter.id}
                                className="border rounded-md overflow-hidden"
                              >
                                <AccordionItem value={chapter.id} className="border-b-0">
                                  <AccordionTrigger className="hover:bg-secondary/20 px-4 py-2 hover:no-underline">
                                    <div className="flex flex-1 items-center justify-between pr-4">
                                      <div className="font-medium">{chapter.name}</div>
                                      <div className="flex items-center gap-3">
                                        <div className="text-sm text-muted-foreground">
                                          {chapter.progress}% complete
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete({ 
                                              type: 'chapter', 
                                              id: chapter.id,
                                              parentId: subject.id
                                            });
                                          }}
                                        >
                                          <Trash className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                        </Button>
                                      </div>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pl-4 pr-2 pb-4 space-y-2">
                                      {chapter.topics.length === 0 ? (
                                        <div className="text-center py-4 text-muted-foreground text-sm">
                                          No topics yet
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {chapter.topics.map((topic: Topic) => (
                                            <div key={topic.id} className="border rounded-md p-3">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <Checkbox 
                                                    id={`topic-${topic.id}`} 
                                                    checked={topic.completed}
                                                    onCheckedChange={(checked) => {
                                                      updateTopic(course.id, subject.id, chapter.id, topic.id, checked as boolean);
                                                    }}
                                                  />
                                                  <Label 
                                                    htmlFor={`topic-${topic.id}`}
                                                    className={`font-medium ${topic.completed ? 'line-through text-muted-foreground' : ''}`}
                                                  >
                                                    {topic.name}
                                                  </Label>
                                                </div>
                                                <Button 
                                                  size="sm" 
                                                  variant="ghost"
                                                  onClick={() => {
                                                    confirmDelete({ 
                                                      type: 'topic', 
                                                      id: topic.id,
                                                      parentId: chapter.id,
                                                      grandParentId: subject.id
                                                    });
                                                  }}
                                                >
                                                  <Trash className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                                </Button>
                                              </div>
                                              
                                              {topic.subtopics.length > 0 && (
                                                <div className="pl-6 mt-2 space-y-2">
                                                  {topic.subtopics.map(subtopic => (
                                                    <div key={subtopic.id} className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <Checkbox 
                                                          id={`subtopic-${subtopic.id}`} 
                                                          checked={subtopic.completed}
                                                          onCheckedChange={(checked) => {
                                                            updateSubtopic(course.id, subject.id, chapter.id, topic.id, subtopic.id, checked as boolean);
                                                          }}
                                                        />
                                                        <Label 
                                                          htmlFor={`subtopic-${subtopic.id}`}
                                                          className={`text-sm ${subtopic.completed ? 'line-through text-muted-foreground' : ''}`}
                                                        >
                                                          {subtopic.name}
                                                        </Label>
                                                      </div>
                                                      <Button 
                                                        size="sm" 
                                                        variant="ghost"
                                                        onClick={() => {
                                                          confirmDelete({ 
                                                            type: 'subtopic', 
                                                            id: subtopic.id,
                                                            parentId: topic.id,
                                                            grandParentId: chapter.id,
                                                            greatGrandParentId: subject.id
                                                          });
                                                        }}
                                                      >
                                                        <Trash className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                                                      </Button>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                              
                                              {selectedTopicId === topic.id ? (
                                                <div className="flex items-center gap-2 mt-2 pl-6">
                                                  <Input
                                                    placeholder="Subtopic name"
                                                    value={newSubtopicName}
                                                    onChange={(e) => setNewSubtopicName(e.target.value)}
                                                    className="text-sm"
                                                  />
                                                  <Button 
                                                    size="sm" 
                                                    onClick={() => handleAddSubtopic(subject.id, chapter.id, topic.id)}
                                                  >
                                                    <Check className="h-3 w-3 mr-1" /> Add
                                                  </Button>
                                                  <Button 
                                                    size="sm" 
                                                    variant="ghost" 
                                                    onClick={() => {
                                                      setSelectedTopicId(null);
                                                      setNewSubtopicName('');
                                                    }}
                                                  >
                                                    Cancel
                                                  </Button>
                                                </div>
                                              ) : (
                                                <Button
                                                  size="sm" 
                                                  variant="ghost" 
                                                  className="mt-2 text-xs ml-6"
                                                  onClick={() => setSelectedTopicId(topic.id)}
                                                >
                                                  <Plus className="h-3 w-3 mr-1" /> Add Subtopic
                                                </Button>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {selectedChapterId === chapter.id ? (
                                        <div className="flex items-center gap-2 mt-4">
                                          <Input
                                            placeholder="Topic name"
                                            value={newTopicName}
                                            onChange={(e) => setNewTopicName(e.target.value)}
                                          />
                                          <Button 
                                            onClick={() => handleAddTopic(subject.id, chapter.id)}
                                          >
                                            <Check className="h-4 w-4 mr-1" /> Add
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                              setSelectedChapterId(null);
                                              setNewTopicName('');
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="outline" 
                                          size="sm"
                                          className="mt-2"
                                          onClick={() => setSelectedChapterId(chapter.id)}
                                        >
                                          <Plus className="h-4 w-4 mr-2" /> Add Topic
                                        </Button>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ))
                          )}
                          
                          {selectedSubjectId === subject.id ? (
                            <div className="flex items-center gap-2 mt-4">
                              <Input
                                placeholder="Chapter name"
                                value={newChapterName}
                                onChange={(e) => setNewChapterName(e.target.value)}
                              />
                              <Button 
                                onClick={() => handleAddChapter(subject.id)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Add
                              </Button>
                              <Button 
                                variant="ghost" 
                                onClick={() => {
                                  setSelectedSubjectId(null);
                                  setNewChapterName('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline" 
                              className="mt-2"
                              onClick={() => setSelectedSubjectId(subject.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Chapter
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a new subject"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="max-w-md"
                />
                <Button onClick={handleAddSubject}>
                  <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the 
              {confirmDialogAction?.type === 'subject' && ' subject'}
              {confirmDialogAction?.type === 'chapter' && ' chapter'}
              {confirmDialogAction?.type === 'topic' && ' topic'}
              {confirmDialogAction?.type === 'subtopic' && ' subtopic'}
              {' '}and all its {' '}
              {confirmDialogAction?.type === 'subject' && 'chapters, topics, and subtopics'}
              {confirmDialogAction?.type === 'chapter' && 'topics and subtopics'}
              {confirmDialogAction?.type === 'topic' && 'subtopics'}
              {confirmDialogAction?.type === 'subtopic' && 'content'}
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;
