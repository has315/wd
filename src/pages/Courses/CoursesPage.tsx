
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useUser } from "@/hooks/use-user";
// import DragDropUpload from "@/components/dashboard/DragDropUpload";
// import NotesList from "@/components/dashboard/NotesList";
// import CourseSettings from "@/components/dashboard/CourseSettings";


export default function CoursesPage() {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState("notes");


  return (
  <>
  Courses
  </>
  );
}
