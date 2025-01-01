
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useUser } from "@/hooks/use-user";
import DragDropUpload from "@/components/dashboard/DragDropUpload";
// import DragDropUpload from "@/components/dashboard/DragDropUpload";
// import NotesList from "@/components/dashboard/NotesList";
// import CourseSettings from "@/components/dashboard/CourseSettings";


export default function DashboardPage() {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState("notes");


  return (
    <>

      <Tabs.Root className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="TabsList" aria-label="Manage your account">
          <Tabs.Trigger className="TabsTrigger" value="tab1">
            1
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="tab2">
            2
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="tab1">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Create New Wisdom Drop</h2>
            <DragDropUpload />
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="tab2">

        </Tabs.Content>
      </Tabs.Root >
    </>
  );
}
