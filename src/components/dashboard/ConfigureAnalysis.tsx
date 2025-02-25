import { TextEditor } from "../textEditor/TextEditor"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { ScrollArea } from "../ui/scroll-area"
import { Slider } from "../ui/slider"
import { BookOpen, Loader2 } from "lucide-react"

export const ConfigureAnalysis = ({ form, note, processingStyle, setProcessingStyle, handleAnalyze, loading }: { form: any, note: any, processingStyle: any, setProcessingStyle: any, handleAnalyze: any, loading: boolean }) => {
    return (
        <Form {...form} >
            <div className="mx-auto">

                <Card>
                    <CardContent className="pt-6">
                        <div className="pb-5">

                            <FormLabel>Configure Your Wisdom Drop</FormLabel>
                        </div>
                        <FormDescription className="pb-2">
                            Review your uploaded notes below. Please make any edits or deletions before we process them.
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
                                    {processingStyle[0] === 1 ? "High granularity - Every note becomes an individual lesson." :
                                        processingStyle[0] === 2 ? "Balanced - Some notes are grouped together, but most remain as individual insights" :
                                            "High synthesis - Multiple notes are condensed into succinct, overarching lessons."}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="mt-4 w-full"
                        >
                            {loading ? (
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
                    </CardContent>
                </Card>

            </div>
        </Form>
    )
}