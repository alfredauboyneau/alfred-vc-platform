"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    async function handleCallback() {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const role = user.user_metadata?.role as "startup" | "vc" | undefined;
        if (role === "vc") {
          router.push("/vc/dashboard");
        } else {
          router.push("/startup/dashboard");
        }
      } else {
        router.push("/login");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto">
          <Zap className="w-7 h-7 text-blue-600" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <div>
          <p className="font-semibold text-slate-800">{t.nav.connecting}</p>
          <p className="text-slate-400 text-sm mt-1">{t.nav.redirecting}</p>
        </div>
      </div>
    </div>
  );
}
