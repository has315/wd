import { Course } from "@/types/Course"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { ScrollArea } from "../ui/scroll-area"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { BookOpen, Loader2 } from "lucide-react"

export const ConfigureCourse = ({ form, course, onSubmit, isLoading }: { form: any, course?: Course | null, onSubmit: any, isLoading: any }) => {
    return (
        <>

            <div>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Configure Course Structure</h3>
                                <div className="text-sm text-muted-foreground">
                                    <p>{course?.totalLessons} lessons selected</p>
                                    <p>{course?.entriesProccesed} Processed notes total</p>
                                </div>
                            </div>

                            <Accordion type="single" collapsible>

                                <FormField
                                    control={form.control}
                                    name="topics"
                                    render={({ field }) =>
                                        <ScrollArea >
                                            <div className="h-[700px]">

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

                                            </div>
                                        </ScrollArea>

                                    }
                                />

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
                                        <FormDescription>
                                            Where do you want to receive your Wisdom Drops
                                        </FormDescription>

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
                                            How often do you want to receive your Wisdom Drops (always at 8:30 am CET)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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

                    </form>
                </Form>
            </div>

        </>

    )
}