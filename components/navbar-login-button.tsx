"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/login-modal";

export function NavbarLoginButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={className ?? "text-slate-600 hover:text-slate-900"}
      >
        Se connecter
      </Button>
      <LoginModal open={open} onOpenChange={setOpen} />
    </>
  );
}
