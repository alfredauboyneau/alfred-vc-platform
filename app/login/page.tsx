"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/startup/dashboard`,
      },
    });

    if (error) {
      setError("Erreur : " + error.message);
    } else {
      setSent(true);
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
          {!sent ? (
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="text-center pb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Connecte-toi à Alfred
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Entre ton email — on t'envoie un lien magique, sans mot de passe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="toi@startup.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <Button type="submit" className="w-full gap-2 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                    ) : (
                      <><Mail className="w-4 h-4" /> Recevoir mon lien de connexion</>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-400">
                    Pas encore de compte ? Il sera créé automatiquement.
                  </p>
                  <Link href="/startup/submit" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    Analyser ma startup gratuitement →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-slate-200">
              <CardContent className="pt-10 pb-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Email envoyé !</h2>
                <p className="text-slate-500 text-sm">
                  Consulte ta boîte mail <strong>{email}</strong> et clique sur le lien pour accéder à ton espace.
                </p>
                <p className="text-xs text-slate-400">
                  Le lien expire dans 60 minutes. Vérifie aussi tes spams.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                  Renvoyer un autre email
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
