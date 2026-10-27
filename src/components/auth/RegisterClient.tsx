"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Não foi possível criar a conta.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-medium tracking-tight text-ice">Criar conta</h1>
      <p className="mt-2 text-[13px] text-steel">
        Acompanhe orçamentos, prazos e entregas em um só lugar.
      </p>
      <div className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-[12px] text-steel">Nome</label>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
          />
        </div>
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[12px] text-steel">Senha</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mín. 6 caracteres"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-steel">Confirmar</label>
            <input
              className="field"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="repita a senha"
              autoComplete="new-password"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
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
          "Criar conta"
        )}
      </button>
      <p className="mt-5 text-center text-[13px] text-steel">
        Já tem conta?{" "}
        <Link href="/login" className="link-underline font-medium text-cobalt-soft">
          Entrar
        </Link>
      </p>
    </div>
  );
}
