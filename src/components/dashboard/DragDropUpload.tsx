
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useNotes } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv']
};

export default function DragDropUpload() {
  // const { upload } = useNotes();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      setError("Please upload only one file at a time");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      
      const result = {content: 'asd'}
      // const result = await upload(formData);
      setNoteContent(result.content);
      setShowEditor(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  }, []);
  // }, [upload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-invalid-type") {
        setError(`Invalid file type. Supported formats: PDF, TXT, CSV files`);
      } else if (error?.code === "too-many-files") {
        setError("Please upload only one file at a time");
      } else {
        setError("Invalid file. Please try again");
      }
    },
  });

  if (showEditor) {
    return (
      <div className="space-y-4">
        <textarea
          className="w-full min-h-[400px] p-4 border rounded-lg"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowEditor(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Save edited content
            setShowEditor(false);
          }}>
            Save & Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Supported formats: PDF, TXT, CSV files
      </div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            {isUploading ? (
              <FileText className="h-12 w-12 text-primary animate-pulse" />
            ) : (
              <Upload className="h-12 w-12 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Drop your notes here to create a new Wisdom Drop</h3>
            <p className="text-sm text-muted-foreground">
              Click to browse or drag and drop your file
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
