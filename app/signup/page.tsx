"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Rocket, Building2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const s = t.signup;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"startup" | "vc">("startup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(s.errorPasswords);
      return;
    }
    if (password.length < 8) {
      setError(s.errorLength);
      return;
    }

    setLoading(true);
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (signupError) {
      setError(signupError.message);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{s.successTitle}</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            {s.successDesc} <strong>{email}</strong>. {s.successDesc2}
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">{s.backToLogin}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Alfred</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-1">{s.title}</h1>
          <p className="text-slate-500 text-sm">{s.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Sélection du rôle */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">{s.iAm}</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("startup")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "startup"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Rocket className="w-5 h-5" />
                  <span className="text-sm font-medium">{s.aStartup}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vc")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "vc"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-sm font-medium">{s.aVC}</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">{t.login.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.login.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">{s.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                placeholder={s.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirm" className="text-sm font-medium text-slate-700">{s.confirmLabel}</Label>
              <Input
                id="confirm"
                type="password"
                placeholder={s.confirmPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? s.submitting : s.submitBtn}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {s.alreadyAccount}{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              {s.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
