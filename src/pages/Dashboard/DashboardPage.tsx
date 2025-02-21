import { useEffect, useState } from "react";
import DragDropUpload from "@/components/dashboard/DragDropUpload";
import { Check, CheckCircle, ChevronLeft, Info } from "lucide-react";
import { useDispatch, useSelector } from "@/store/store";
import { getNotes } from "@/store/slices/note";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { analzyeCourse, createCourse } from "@/store/slices/course";

import { ConfigureAnalysis } from "@/components/dashboard/ConfigureAnalysis";
import { ConfigureCourse } from "@/components/dashboard/ConfigureCourse";
import { Button } from "@/components/ui/button";




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
  topics: z.array(topicSchema),
  totalLessons: z.number(),
  totalTopics: z.number()
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
      topics: []
    },
  });




  const onSubmit = async (data: any) => {
    const result = await dispatch(createCourse({ course: data }))

    if (result?.status === 200) {
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

      toast('This can take between 2-5 minutes. Please leave this window open', { type: "warning" })
      const analysis = await dispatch(analzyeCourse({ notes: [note], processingStyle: processingStyle[0] }))

      if (analysis?.status === 200) {
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
              disabled={tab !== "tab1"}
            >
              <CheckCircle size={20} />
            </TabsTrigger>

            <div className="flex-grow"></div>

            <TabsTrigger
              className="hover:text-[#305D88] data-[state=active]:text-[#02234F] data-[state=active]:bg-green-200  z-10 relative rounded-full flex items-center justify-center  border-2 border-gray-300 bg-white"
              value="tab2"
              disabled={tab !== "tab2"}

            >
              <Info size={20} />
            </TabsTrigger>

            <div className="flex-grow"></div>

            <TabsTrigger
              className="hover:text-[#305D88] data-[state=active]:text-[#02234F] data-[state=active]:bg-green-200  z-10 relative rounded-full flex items-center justify-center  border-2 border-gray-300 bg-white"
              value="tab3"
              disabled={tab !== "tab3"}

            >
              <Check size={20} />
            </TabsTrigger>
          </div>


        </TabsList>
        <TabsContent className="TabsContent" value="tab1">
          <div className="mx-auto">
            <h2 className="text-2xl font-semibold mb-2">
              Create a New Wisdom Drop
            </h2>


            <DragDropUpload setTab={setTab} />


          </div>
        </TabsContent>
        <TabsContent className="TabsContent" value="tab2">
          <ConfigureAnalysis form={form} handleAnalyze={handleAnalyze} loading={courseLoading} processingStyle={processingStyle} setProcessingStyle={setProcessingStyle} note={note} />
          <Button className="mt-4" onClick={() => setTab("tab1")} disabled={courseLoading}>
            <ChevronLeft />
            Back
          </Button>
        </TabsContent>
        <TabsContent className="TabsContent" value="tab3">
          <ConfigureCourse course={course} form={form} isLoading={courseLoading} onSubmit={onSubmit} />
          <Button className="mt-4" onClick={() => setTab("tab2")} disabled={courseLoading}>
            <ChevronLeft />
            Back
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );
}
