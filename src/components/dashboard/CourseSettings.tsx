import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useNotes } from "@/hooks/use-notes";
import { useCourseAnalysis } from "@/hooks/use-course-analysis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from 'wouter';

interface CourseSection {
  number: string;
  title: string;
  learningContent: string;
  story: string;
  reflectionQuestion: string;
  noteIds: number[];
  selected: boolean;
}

interface CourseTopic {
  title: string;
  sections: CourseSection[];
  relatedNoteIds: number[];
}

interface CourseAnalysis {
  recommendedLessons: number;
  totalNotesProcessed: number;
  topics: CourseTopic[];
  unusedNoteIds: number[];
}

// Form validation schema
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  delivery: z.object({
    channel: z.enum(["email", "slack", "whatsapp"]),
    frequency: z.enum(["daily", "weekly", "biweekly"]),
  }),
  noteIds: z.array(z.number()).min(1, "Select at least one note"),
  active: z.boolean(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CourseSettings() {
  const [location] = useLocation();
  const { notes, isLoading: isLoadingNotes } = useNotes();
  const urlParams = new URLSearchParams(location);
  const preselectedNoteId = urlParams.get('noteId');
  const { analyze, isAnalyzing: initialIsAnalyzing, error: analysisError } =
    useCourseAnalysis();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [courseStructure, setCourseStructure] = useState<CourseTopic[]>([]);
  const [unusedNotes, setUnusedNotes] = useState<number[]>([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [processingStyle, setProcessingStyle] = useState<number[]>([1]); // Default to most granular
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      delivery: {
        channel: "email",
        frequency: "daily",
      },
      noteIds: preselectedNoteId ? [Number(preselectedNoteId)] : [],
      active: true,
    },
  });

  const toggleSection = (topicIndex: number, sectionIndex: number) => {
    setCourseStructure((prev) => {
      const newStructure = [...prev];
      newStructure[topicIndex].sections[sectionIndex].selected =
        !newStructure[topicIndex].sections[sectionIndex].selected;
      return newStructure;
    });

    updateDescription();
  };

  const updateDescription = () => {
    const description = courseStructure
      .map((topic) => {
        const selectedSections = topic.sections
          .filter((section) => section.selected)
          .map((section) => `${section.number}. ${section.title}`)
          .join("\n");

        if (selectedSections) {
          return `${topic.title}\n${selectedSections}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n\n");

    form.setValue("description", description);
  };

  const getProcessingDescription = (value: number) => {
    if (value <= 3) {
      return "Create individual lessons from each note (best for condensed, point-form notes)";
    } else if (value <= 7) {
      return "Balance between individual points and combined insights";
    } else {
      return "Heavily synthesize content into focused lessons (best for long-form notes)";
    }
  };

  const handleAnalyze = async () => {
    const noteIds = form.getValues("noteIds");
    if (noteIds.length === 0) {
      setErrorDialog({
        open: true,
        message: "Please select at least one note to analyze",
      });
      return;
    }

    setIsAnalyzing(true);
    setCourseStructure([]); // Clear previous analysis

    try {
      console.log("Starting analysis with:", {
        noteIds,
        processingStyle: processingStyle[0],
      });

      const analysis = await analyze(noteIds, processingStyle[0]);

      if (!analysis) {
        throw new Error("Analysis failed to return results");
      }

      if (!analysis.topics || analysis.topics.length === 0) {
        throw new Error("No course structure was generated");
      }

      setCourseStructure(analysis.topics);
      setUnusedNotes(analysis.unusedNoteIds || []);
      setTotalProcessed(analysis.totalNotesProcessed || 0);

      if (analysis.topics.length > 0) {
        form.setValue("title", `${analysis.topics[0].title} Course`);
      }

      updateDescription();

      toast({
        title: "Analysis Complete",
        description: `Created ${analysis.topics.reduce(
          (acc, topic) => acc + topic.sections.length,
          0
        )} lessons from ${analysis.totalNotesProcessed} notes`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorDialog({
        open: true,
        message: error instanceof Error ? error.message : "Failed to analyze notes",
      });
      setCourseStructure([]);
      setUnusedNotes([]);
      setTotalProcessed(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createCourseMutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create course");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      form.reset();
      setCourseStructure([]);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: CourseFormValues) => {
    createCourseMutation.mutate(values);
  };

  if (isLoadingNotes) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ open, message: errorDialog.message })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-wrap text-destructive">
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog({ open: false, message: "" })}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="noteIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step 1: Select Notes and Configure Analysis</FormLabel>
                    <FormDescription>
                      Choose the notes to include in this course and adjust the processing style
                    </FormDescription>
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      <div className="space-y-4">
                        {notes?.map((note) => (
                          <label
                            key={note.id}
                            className="flex items-start space-x-3 space-y-0"
                          >
                            <Checkbox
                              id={`note-${note.id}`}
                              checked={field.value?.includes(note.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                const newValue = checked
                                  ? [...currentValue, note.id]
                                  : currentValue.filter((id) => id !== note.id);
                                field.onChange(newValue);
                              }}
                            />
                            <div className="space-y-1">
                              <p className="font-medium leading-none">{note.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {note.content.slice(0, 100)}...
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {note.tags?.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                    <FormMessage />

                    <div className="mt-6 space-y-4">
                      <h4 className="font-medium">Processing Style</h4>
                      <div className="space-y-2">
                        <Slider
                          value={processingStyle}
                          onValueChange={setProcessingStyle}
                          min={1}
                          max={3}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground">
                          {processingStyle[0] === 1 ? "High granularity - most notes become individual lessons" :
                           processingStyle[0] === 2 ? "Balanced - mix of synthesis and individual notes" :
                           "High synthesis - condensed learning points"}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || isLoadingNotes || field.value.length === 0}
                      className="mt-4 w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Notes...
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-4 w-4" />
                          {courseStructure.length === 0
                            ? "Step 2: Analyze Selected Notes"
                            : "Re-analyze Notes"}
                        </>
                      )}
                    </Button>
                  </FormItem>
                )}
              />

              {courseStructure.length > 0 ? (
                <>
                  <div className="space-y-4">
                    <FormLabel>Step 3: Review and Customize Course Structure</FormLabel>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Course Structure</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {courseStructure.reduce((acc, topic) =>
                            acc + topic.sections.filter((s) => s.selected).length, 0
                          )}{" "}
                          lessons selected
                        </p>
                        <p>Processed {totalProcessed} notes total</p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible>
                      {courseStructure.map((topic, topicIndex) => (
                        <div key={topicIndex} className="border rounded-lg mb-4">
                          <div className="p-4">
                            <h4 className="font-semibold text-lg mb-2">
                              {topic.title}
                              {topic.relatedNoteIds?.length > 0 && (
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                  ({topic.relatedNoteIds.length} related notes)
                                </span>
                              )}
                            </h4>
                            <div className="space-y-2">
                              {topic.sections.map((section, sectionIndex) => (
                                <AccordionItem
                                  key={`${topicIndex}-${sectionIndex}`}
                                  value={`${topicIndex}-${sectionIndex}`}
                                  className="border-none"
                                >
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={section.selected}
                                      onCheckedChange={() =>
                                        toggleSection(topicIndex, sectionIndex)
                                      }
                                      className="mt-1"
                                    />
                                    <div className="space-y-1">
                                      <span className="text-sm text-muted-foreground">
                                        {section.noteIds.length} source notes
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <AccordionTrigger className="hover:no-underline py-0">
                                        <div className="flex items-center justify-between w-full">
                                          <span className="font-medium">
                                            {section.number}. {section.title}
                                          </span>
                                          
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="pt-2">
                                        <div className="space-y-4">
                                          <div>
                                            <h5 className="font-medium mb-1">Learning Content</h5>
                                            <p className="text-sm text-muted-foreground">
                                              {section.learningContent}
                                            </p>
                                          </div>
                                          <div>
                                            <h5 className="font-medium mb-1">Story/Parable</h5>
                                            <p className="text-sm text-muted-foreground">
                                              {section.story}
                                            </p>
                                          </div>
                                          <div>
                                            <h5 className="font-medium mb-1">Reflection Question</h5>
                                            <p className="text-sm text-muted-foreground">
                                              {section.reflectionQuestion}
                                            </p>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </div>
                                  </div>
                                </AccordionItem>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Accordion>

                    {unusedNotes.length > 0 && (
                      <div className="mt-4 p-4 border rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">
                          {unusedNotes.length} notes were not directly included in the lessons but are
                          available for future expansion.
                        </p>
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step 4: Configure Course Details</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter course title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Course overview" className="min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="delivery.channel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Channel</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select channel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="slack">Slack</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="delivery.frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often you want to receive your wisdom drops
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Activate Course
                          </FormLabel>
                          <FormDescription>
                            When active, this course will start delivering wisdom drops based on your
                            schedule
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Course...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Step 5: Create Course
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <BookOpen className="mx-auto h-12 w-12 mb-4" />
                  <p>
                    Select notes and click "Analyze Selected Notes" to generate course structure
                  </p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}