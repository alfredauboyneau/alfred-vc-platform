"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Zap } from "lucide-react";

/**
 * Page de callback après confirmation d'email Supabase.
 * Supabase redirige ici avec les tokens dans l'URL (#access_token=... ou ?code=...).
 * Le client Supabase les traite automatiquement, puis on redirige vers le bon dashboard.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      // Laisser le client Supabase traiter les tokens de l'URL
      // (hash #access_token ou query param ?code=)
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
        // Pas de session → page de connexion
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
          <p className="font-semibold text-slate-800">Connexion en cours…</p>
          <p className="text-slate-400 text-sm mt-1">Vous allez être redirigé vers votre espace</p>
        </div>
      </div>
    </div>
  );
}
