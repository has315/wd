import { useEffect, useState } from "react";
import DragDropUpload from "@/components/dashboard/DragDropUpload";
import NotesList from "@/components/dashboard/NotesList";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, CheckCircle, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { dispatch, useDispatch, useSelector } from "@/store/store";
import { getNotes } from "@/store/slices/note";
// import DragDropUpload from "@/components/dashboard/DragDropUpload";
// import NotesList from "@/components/dashboard/NotesList";
// import CourseSettings from "@/components/dashboard/CourseSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Badge, Loader2, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";
import { TextEditor } from "@/components/textEditor/TextEditor";
import { analzyeCourse, createCourse } from "@/store/slices/course";
import { title } from "process";
import { InfoCircledIcon } from "@radix-ui/react-icons";




const lessonSchema = z.object({
  title: z.string(),
  learningContent: z.string(),
  story: z.string(),
  reflectionQuestion: z.string(),
  note: z.string(),
});

const topicSchema = z.object({
  title: z.string(),
  lessons: z.array(lessonSchema),
});



// Form validation schema
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  delivery: z.object({
    channel: z.enum(["email", "slack", "whatsapp"]),
    frequency: z.enum(["daily", "weekly", "biweekly"]),
  }),
  active: z.boolean(),
  topics: z.array(topicSchema)
});

type CourseFormValues = z.infer<typeof courseSchema>;




export default function DashboardPage() {

  const [tab, setTab] = useState("tab1");

  const [processingStyle, setProcessingStyle] = useState<number[]>([1]); // Default to most granular



  const { note, isLoading } = useSelector(state => state.note)
  const { course, isLoading: courseLoading } = useSelector(state => state.course)
  const dispatch = useDispatch();



  const onTabChange = (value: string) => {
    setTab(value);
  };

  useEffect(() => {
    dispatch(getNotes())

  }, [])


  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      delivery: {
        channel: "email",
        frequency: "daily",
      },
      active: true,
      topics: []
    },
  });




  const onSubmit = async (data: any) => {
    const result = await dispatch(createCourse({ course: data }))

    if (result?.status === 2000) {
      toast('Course created', { type: "success" })
      return
    }
    toast('Course failed to create', { type: "error" })
  }

  const handleAnalyze = async () => {
    if (!note) {
      toast("Please select at least one note to analyze", { type: "error" })
      return;
    }


    try {
      console.log("Starting analysis with:", {
        note,
        processingStyle: processingStyle[0],
      });

      dispatch(analzyeCourse({ notes: [{ ...note }], processingStyle: processingStyle[0] }))


      if (!isLoading && course) {
        toast("Analysis Complete", { type: "success" })
        setTab("tab3")
      }



    } catch (error) {
      console.error("Analysis failed:", error);

    } finally {
    }
  };


  useEffect(() => {
    if (course) {
      console.log(course)
      form.reset({ ...course })
    }
  }, [course])

  return (
    <>
      <Tabs
        className="TabsRoot w-full"
        defaultValue="tab1"
        value={tab}
        onValueChange={onTabChange}
      >
        <TabsList className="TabsList flex items-center" aria-label="Step-by-step progress" >
          <div className="relative flex items-center w-full">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0"></div>

            <TabsTrigger
              className="hover:text-[#305D88] data-[state=active]:text-[#02234F] data-[state=active]:bg-green-200 z-10 relative rounded-full flex items-center justify-center border-2 border-gray-300 bg-white"
              value="tab1"
            >
              <CheckCircle size={20} />
            </TabsTrigger>

            <div className="flex-grow"></div>

            <TabsTrigger
              className="hover:text-[#305D88] data-[state=active]:text-[#02234F] data-[state=active]:bg-green-200  z-10 relative rounded-full flex items-center justify-center  border-2 border-gray-300 bg-white"
              value="tab2"
            >
              <Info size={20} />
            </TabsTrigger>

            <div className="flex-grow"></div>

            <TabsTrigger
              className="hover:text-[#305D88] data-[state=active]:text-[#02234F] data-[state=active]:bg-green-200  z-10 relative rounded-full flex items-center justify-center  border-2 border-gray-300 bg-white"
              value="tab3"
            >
              <Check size={20} />
            </TabsTrigger>
          </div>


        </TabsList>
        <TabsContent className="TabsContent" value="tab1">
          <div className="mx-auto">
            <h2 className="text-2xl font-semibold mb-2">
              Create New Wisdom Drop
            </h2>
            <DragDropUpload setTab={setTab} />


          </div>
        </TabsContent>
        <TabsContent className="TabsContent" value="tab2">

          <Form {...form} >
            <div className="mx-auto">

              <Card>
                <CardContent className="pt-6">
                  <FormLabel>Configure Analysis</FormLabel>
                  <FormDescription>
                    Configure content and the processing style
                  </FormDescription>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-4">
                          <ScrollArea className="h-[300px] rounded-md border p-4">

                            <TextEditor note={note} />
                          </ScrollArea>

                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Processing Style</h4>
                    <div className="space-y-2">
                      <Slider
                        value={processingStyle}
                        onValueChange={setProcessingStyle}
                        defaultValue={processingStyle}
                        min={1}
                        max={3}
                        step={1}
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
                    disabled={courseLoading}
                    className="mt-4 w-full"
                  >
                    {courseLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Notes...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Analyze Selected Notes
                      </>
                    )}
                  </Button>
                  <div className="text-center p-8 text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 mb-4" />
                    <p>
                      click "Analyze Selected Notes" to generate course structure
                    </p>
                    <div className="flex items-center w-full justify-center pt-5">
                      <InfoCircledIcon width={32} height={32}/>
                      <p>Please be patient, this may take some time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between mt-2">
                <Button onClick={() => setTab("tab1")}>
                  <ChevronLeft className="ml-2 h-4 w-4" />
                  Previous step
                </Button>
                <Button onClick={() => setTab("tab3")}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Form>
        </TabsContent>
        <TabsContent className="TabsContent" value="tab3">

          <div>
            <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Configure Course Structure</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>

                        lessons selected
                      </p>
                      <p>Processed notes total</p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <ScrollArea>

                      <FormField
                        control={form.control}
                        name="topics"
                        render={({ field }) =>
                          <>
                            {course?.topics?.map((topic, topicIndex) => (
                              <div key={topicIndex} className="border rounded-lg mb-4">
                                <div className="p-4">
                                  <h4 className="flex items-center gap-2 font-semibold text-lg mb-2">
                                    <span className="font-medium">
                                      {topicIndex + 1}.
                                    </span>
                                    {topic.title}
                                  </h4>
                                  <div className="space-y-2">
                                    {topic.lessons?.map((section, sectionIndex) => (
                                      <AccordionItem
                                        key={`${topicIndex}-${sectionIndex}`}
                                        value={`${topicIndex}-${sectionIndex}`}
                                        className="border-none"
                                      >
                                        <div className="flex items-start space-x-2">
                                          <Checkbox
                                            checked={true}
                                            // onCheckedChange={() =>
                                            //   toggleSection(topicIndex, sectionIndex)
                                            // }
                                            className="mt-1"
                                          />
                                          <div className="space-y-1">
                                            {/* <span className="text-sm text-muted-foreground">
                                      {section.noteIds?.length} source notes
                                    </span> */}
                                          </div>
                                          <div className="flex-1">
                                            <AccordionTrigger className="hover:no-underline py-0">
                                              <div className="flex items-center justify-between w-full">
                                                <span className="font-medium">
                                                  {sectionIndex + 1}. {section.title}
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
                          </>

                        }
                      />
                    </ScrollArea>

                  </Accordion>

                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                  disabled={isLoading}
                >
                  {isLoading ? (
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

                <button
                  type="button"
                  onClick={async () => {
                    const trigger = await form.trigger()
                    console.log(trigger)
                    console.log(form.formState.errors)
                    console.log(form.getValues())
                  }}
                >
                  Trigger All
                </button>
              </form>
            </Form>
          </div>
          <div className="flex justify-start mt-2">
            <Button onClick={() => setTab("tab2")}>
              <ChevronLeft className="ml-2 h-4 w-4" />
              Previous Step
            </Button>

          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
