import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useNotes } from "@/hooks/use-notes";
import { useToast } from "@/hooks/use-toast";

export default function NoteUpload() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useNotes();
  const { toast } = useToast();

  const handleUpload = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      await upload(formData);

      // Reset form using the ref
      if (formRef.current) {
        formRef.current.reset();
      }

      // Reset file input separately to ensure it's cleared
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
      });
    }
  }, [upload, toast]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form ref={formRef} onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Note title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.csv"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source (Optional)</Label>
            <Input
              id="source"
              name="source"
              placeholder="e.g., Book name, podcast, seminar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <Button type="submit" className="w-full">
            Upload Note
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}