"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role as "startup" | "vc" | undefined;

    if (role === "vc") {
      // Chercher le VC lié à ce user
      const { data: vc } = await supabase
        .from("venture_capitals")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      if (vc) {
        router.push(`/vc/dashboard?id=${vc.id}`);
      } else {
        router.push("/vc/register");
      }
    } else {
      // Chercher la startup liée à ce user
      const { data: startup } = await supabase
        .from("startups")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      if (startup) {
        router.push(`/startup/dashboard?id=${startup.id}`);
      } else {
        router.push("/startup/submit");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Alfred</span>
          </Link>
        </div>
      </nav>

      {/* Contenu */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-7">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Connecte-toi à Alfred</h1>
              <p className="text-slate-500 text-sm mt-1">Accède à ton espace startup ou investisseur</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="toi@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ton mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Connexion...</>
                ) : (
                  "Se connecter →"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
