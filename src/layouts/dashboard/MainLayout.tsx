import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link, Outlet } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { PopoverPortal } from "@radix-ui/react-popover";
import { PopoverContent } from "@/components/ui/popover";
import { CircleUser } from "lucide-react";
import { useDispatch } from "@/store/store";
import { logout } from "@/store/slices/auth";
import { Logo } from "@/icons/Logo"
export default function MainLayout() {
  const dispatch = useDispatch();




  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo height="68" width="120"/>
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="inline-flex size-[35px] cursor-default items-center justify-center rounded-full bg-white text-violet11 outline-none hover:text-primaryLight"
                  aria-label="Update dimensions"
                >
                  <CircleUser />
                </button>
              </Popover.Trigger>
              <PopoverPortal>
                <PopoverContent
                  className="w-[260px] rounded bg-white p-5"
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <p className="mb-2.5 text-[15px] font-medium leading-[19px] text-mauve12">
                        Profile settings
                      </p>
                      <Popover.Close
                        className="cursor-default items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet4 "
                        aria-label="Close"
                      >
                        <Cross2Icon />
                      </Popover.Close>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2.5">
                        <Link to="/profile/settings" className="hover:bg-primary/20">
                          Profile
                        </Link>
                      </div>
                      <Button onClick={() => dispatch(logout())}>Logout</Button>
                    </div>
                  </div>

                  <Popover.Arrow className="fill-white" />
                </PopoverContent>
              </PopoverPortal>
            </Popover.Root>
          </div>
        </div>
      </header>

      <main className="flex">
        <section className="min-h-screen pl-10 flex flex-col bg-[#f3f3f3] w-[180px]">
          <NavigationMenu.Root orientation="vertical">
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
        <div className="px-4 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
