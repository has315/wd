import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useUser } from "@/hooks/use-user";
import DragDropUpload from "@/components/dashboard/DragDropUpload";
import NotesList from "@/components/dashboard/NotesList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import DragDropUpload from "@/components/dashboard/DragDropUpload";
// import NotesList from "@/components/dashboard/NotesList";
// import CourseSettings from "@/components/dashboard/CourseSettings";

const MOCK_COURSES = [
  {
    id: 1,
    user_id: 1,
    title: "test topic course",
    description: "test",
    delivery: { channel: "slack", frequency: "daily" },
    active: "t",
  },
];

export default function DashboardPage() {
  const { user, logout } = useUser();

  const [tab, setTab] = useState("tab1");

  const onTabChange = (value: string) => {
    setTab(value);
  };

  return (
    <>
      <Tabs.Root
        className="TabsRoot"
        defaultValue="tab1"
        value={tab}
        onValueChange={onTabChange}
      >
        <Tabs.List className="TabsList" aria-label="Crate wisdom drop">
          <Tabs.Trigger
            className="hover:text-[#7393B3] data-[state=active]:text-black data-[state=active]:bg-[#f3f3f3] rounded w-[24px] h-[24px]"
            value="tab1"
          >
            1
          </Tabs.Trigger>
          <Tabs.Trigger
            className="hover:text-[#7393B3] data-[state=active]:text-black data-[state=active]:bg-[#f3f3f3] rounded w-[24px] h-[24px]"
            value="tab2"
          >
            2
          </Tabs.Trigger>
          <Tabs.Trigger
            className="hover:text-[#7393B3] data-[state=active]:text-black data-[state=active]:bg-[#f3f3f3] rounded w-[24px] h-[24px]"
            value="tab3"
          >
            3
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="tab1">
          <div className="mx-auto w-full">
            <h2 className="text-2xl font-semibold mb-2">
              Create New Wisdom Drop
            </h2>
            <DragDropUpload />

            <div className="flex justify-end">
              <Button onClick={() => setTab("tab1")}>
                <ChevronLeft className="ml-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button onClick={() => setTab("tab2")}>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="tab2">
          <div className="mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
            <p className="text-muted-foreground mb-4">
              Select a note to create a new course
            </p>
            <NotesList />

            <div className="flex justify-between">
              <Button onClick={() => setTab("tab1")}>
                <ChevronLeft className="ml-2 h-4 w-4" />
                Previous step
              </Button>
              <Button onClick={() => setTab("tab3")}>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="tab3">
          <div className="flex justify-end">
            <Button onClick={() => setTab("tab2")}>
              <ChevronLeft className="ml-2 h-4 w-4" />
              Previous Step
            </Button>
            {/* <Button onClick={() => setTab("tab2")}>
              Next Step
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button> */}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
