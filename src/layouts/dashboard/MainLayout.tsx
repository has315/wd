
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MainLayout() {


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

          </div>
        </div>
      </header>

      <main className="flex">
        <section className="min-h-screen pl-10 flex flex-col bg-[#f3f3f3] w-[180px]">
          <NavigationMenu.Root orientation="vertical" >
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <Link to="/dashboard">Dashboard</Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <Link to="/courses">Courses</Link>
              </NavigationMenu.Item>
              <NavigationMenu.Indicator className="NavigationMenuIndicator" />
            </NavigationMenu.List>

            <NavigationMenu.Viewport />
          </NavigationMenu.Root>
        </section>
        <Outlet />
      </main>
    </div>
  );
}
