import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { PulsoMark } from "../components/brand/PulsoMark";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";

export function SignUpScreen({ onCreateAccount, authError, authSuccess, onGoToLogin }) {
  const [form, setForm] = React.useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await onCreateAccount(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneShell showNav={false}>
      <div className="bg-white px-6 pt-7 pb-5 border-b border-[#0F3D3E]/8">
        <div className="flex items-center gap-3">
          <PulsoMark />
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#0F3D3E]/55">
              PULSO
            </p>
            <h2 className="text-2xl font-semibold text-[#1E1E1E] mt-2">
              Criar conta
            </h2>
          </div>
        </div>

        <p className="text-sm text-[#1E1E1E]/60 mt-4 max-w-[280px]">
          Estruture sua operação com uma base profissional desde o primeiro acesso.
        </p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Field label="Seu nome">
          <Input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Seu nome"
          />
        </Field>

        <Field label="Nome do negócio">
          <Input
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            placeholder="Ex: Studio Mariana"
          />
        </Field>

        <Field label="Email">
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
          />
        </Field>

        <Field label="Senha">
          <div className="rounded-2xl bg-[#F4EFE8] px-4 py-3 flex items-center justify-between text-sm text-[#1E1E1E] border border-transparent focus-within:border-[#0F3D3E]/20">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="bg-transparent outline-none flex-1"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-[#0F3D3E] font-medium text-xs"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>

        {authError ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {authError}
          </div>
        ) : null}

        {authSuccess ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            {authSuccess}
          </div>
        ) : null}

        <div className="space-y-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold shadow-md disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          <button
            type="button"
            onClick={onGoToLogin}
            className="w-full rounded-2xl border border-[#0F3D3E]/15 bg-white text-[#0F3D3E] py-3.5 text-sm font-semibold"
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}