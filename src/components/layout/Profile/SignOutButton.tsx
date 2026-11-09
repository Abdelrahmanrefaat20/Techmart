"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <Button
      type="button"
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      className="mt-5 w-full rounded-full bg-[#d1f391] text-[#1d2c26] hover:bg-[#e2ffb2]"
    >
      <LogOut aria-hidden="true" />
      Sign out
    </Button>
  );
}
