

import { useEffect, useState } from 'react';
import { getCourses, setDialogueOpen } from '@/store/slices/course';
import { useDispatch, useSelector } from '@/store/store';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { columndDefs } from '@/lib/gridDefinition';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';



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


export default function CoursesPage() {
  const dispatch = useDispatch()
  const { courses, courseDialogueOpen, selectedCourse } = useSelector(state => state.course)

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

  useEffect(() => {
    dispatch(getCourses())
  }, [])


  useEffect(() => {
    if (selectedCourse) {
      form.reset({ ...selectedCourse })
    }
  }, [selectedCourse])

  return (
    <div className='pt-2.5 w-full h-[620px]'>
      
      <AgGridReact rowData={courses} columnDefs={columndDefs} />

      <Dialog open={courseDialogueOpen} onOpenChange={() => dispatch(setDialogueOpen(false))}>

        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <Form {...form} >

              <DialogTitle>Edit course</DialogTitle>
              <DialogDescription>Configure your course settings</DialogDescription>

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

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogClose />
            </Form>
          </DialogContent>
        </DialogPortal>


      </Dialog>
    </div>
  );
};


