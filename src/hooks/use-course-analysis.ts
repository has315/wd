import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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

export function useCourseAnalysis() {
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (params: { noteIds: number[], processingStyle: number }): Promise<CourseAnalysis> => {
      console.log('Starting course analysis with params:', params);

      const response = await fetch("/api/courses/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        credentials: "include",
      });

      const data = await response.text(); // Get raw response text first
      console.log('Raw API response:', data);

      if (!response.ok) {
        console.error('Analysis failed:', {
          status: response.status,
          statusText: response.statusText,
          data
        });

        let errorMessage: string;
        try {
          const errorData = JSON.parse(data);
          errorMessage = errorData.error || 'Failed to analyze notes';
        } catch (e) {
          errorMessage = data || 'Failed to analyze notes';
        }

        throw new Error(errorMessage);
      }

      try {
        const result = JSON.parse(data);
        console.log('Parsed analysis result:', result);
        return result;
      } catch (e) {
        console.error('Failed to parse analysis response:', e);
        throw new Error('Invalid response from server');
      }
    },
    onError: (error: Error) => {
      console.error('Course analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message,
        duration: null, // Make error toast persist until dismissed
      });
    },
  });

  return {
    analyze: (noteIds: number[], processingStyle: number) => 
      analyzeMutation.mutateAsync({ noteIds, processingStyle }),
    isAnalyzing: analyzeMutation.isPending,
    error: analyzeMutation.error,
  };
}