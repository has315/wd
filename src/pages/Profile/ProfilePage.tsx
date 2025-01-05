import { useState } from "react";
import { useUser } from "@/hooks/use-user";

export default function DashboardPage() {
  const { user, logout } = useUser();

  return (
    <>
    Profile Page
    </>
  );
}
