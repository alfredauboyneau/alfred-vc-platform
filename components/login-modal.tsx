"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const l = t.login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(l.errorMsg);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role as "startup" | "vc" | undefined;

    if (role === "vc") {
      router.push("/vc/dashboard");
    } else {
      router.push("/startup/dashboard");
    }

    setLoading(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        {/* Header bleu */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 pt-6 pb-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-white text-xl font-bold tracking-tight">Alfred</DialogTitle>
          </div>
          <p className="text-blue-100 text-sm leading-snug">
            {l.subtitle}
          </p>
        </div>

        {/* Formulaire */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="modal-email" className="text-sm font-medium text-slate-700">
                {l.emailLabel}
              </Label>
              <Input
                id="modal-email"
                type="email"
                placeholder={l.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="modal-password" className="text-sm font-medium text-slate-700">
                {l.passwordLabel}
              </Label>
              <Input
                id="modal-password"
                type="password"
                placeholder={l.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {l.submitting}
                </>
              ) : (
                l.submitBtn
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            {l.noAccount}{" "}
            <Link
              href="/signup"
              onClick={() => onOpenChange(false)}
              className="text-blue-600 font-medium hover:underline"
            >
              {l.createAccount}
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
