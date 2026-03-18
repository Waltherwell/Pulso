import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { PulsoMark } from "../components/brand/PulsoMark";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";

export function LoginScreen({ onEnter }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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
              Entrar
            </h2>
          </div>
        </div>

        <p className="text-sm text-[#1E1E1E]/60 mt-4 max-w-[280px]">
          Acesse sua conta para continuar organizando seu negócio e acompanhando
          seus resultados.
        </p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Field label="Email">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </Field>

        <Field label="Senha">
          <div className="rounded-2xl bg-[#F4EFE8] px-4 py-3 flex items-center justify-between text-sm text-[#1E1E1E] border border-transparent focus-within:border-[#0F3D3E]/20">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none flex-1"
              placeholder="••••••••"
            />
            <button
              onClick={() => setShowPassword((value) => !value)}
              className="text-[#0F3D3E] font-medium text-xs"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>

        <div className="space-y-3 pt-2">
          <button
            onClick={onEnter}
            className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold shadow-md"
          >
            Entrar no painel
          </button>

          <button
            onClick={onEnter}
            className="w-full rounded-2xl border border-[#0F3D3E]/15 bg-white text-[#0F3D3E] py-3.5 text-sm font-semibold"
          >
            Continuar com Google
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}