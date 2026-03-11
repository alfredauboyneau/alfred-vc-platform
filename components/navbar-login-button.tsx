"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/login-modal";
import { useLanguage } from "@/lib/i18n";

export function NavbarLoginButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={className ?? "text-slate-600 hover:text-slate-900"}
      >
        {t.nav.signIn}
      </Button>
      <LoginModal open={open} onOpenChange={setOpen} />
    </>
  );
}
