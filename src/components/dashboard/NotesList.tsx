import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/use-notes";
import { Loader2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "@/store/store";
import { setSelectedNote } from "@/store/slices/note";


export default function NotesList() {

  const { notes, note: selectedNote, isLoading } = useSelector(state => state.note)
  const dispatch = useDispatch();

  const handleNoteSelect = (note: any) => {
    dispatch(setSelectedNote(note))
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!notes?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No notes uploaded yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-4">
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`cursor-pointer transition-colors ${selectedNote?.id === note.id ? "border-primary" : ""
                }`}
              onClick={() => handleNoteSelect(note)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                {note.content.length > 200
                    ? `${note.content.slice(0, 200)}...`
                    : note.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* {note.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))} */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

    </div>
  );
}
