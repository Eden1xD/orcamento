"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginClient({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Não foi possível entrar.");
        return;
      }
      router.push(next && next.startsWith("/") ? next : data.redirect || "/");
      router.refresh();
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-medium tracking-tight text-ice">Entrar</h1>
      <p className="mt-2 text-[13px] text-steel">
        Acesse sua conta para acompanhar orçamentos e projetos.
      </p>
      <div className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-[12px] text-steel">E-mail</label>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] text-steel">Senha</label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
      </div>
      {error && (
        <p className="mt-4 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-300">
          {error}
        </p>
      )}
      <button
        onClick={submit}
        disabled={loading}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-cobalt text-[14px] font-medium text-ice transition-all hover:bg-cobalt-soft disabled:opacity-50"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ice/30 border-t-ice" />
        ) : (
          "Entrar"
        )}
      </button>
      <p className="mt-5 text-center text-[13px] text-steel">
        Não tem conta?{" "}
        <Link href="/cadastro" className="link-underline font-medium text-cobalt-soft">
          Criar uma
        </Link>
      </p>
      
    </div>
  );
}
