import React from "react";
import { onboardingSteps } from "../data/constants";
import { PhoneShell } from "../components/layout/PhoneShell";
import { PulsoMark } from "../components/brand/PulsoMark";
import { cx } from "../utils/cx";

export function OnboardingScreen({ onSkip, onCreateAccount, onLogin }) {
  const [stepIndex, setStepIndex] = React.useState(0);
  const step = onboardingSteps[stepIndex];

  function nextStep() {
    if (stepIndex === onboardingSteps.length - 1) {
      onCreateAccount();
      return;
    }
    setStepIndex((value) => value + 1);
  }

  return (
    <PhoneShell showNav={false}>
      <div className="bg-[#0F3D3E] px-6 pt-7 pb-8 text-white min-h-[320px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PulsoMark dark={true} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">
                PULSO
              </p>
              <h1 className="text-base font-semibold mt-1">Boas-vindas</h1>
            </div>
          </div>

          <button onClick={onSkip} className="text-xs font-medium text-white/70">
            Pular
          </button>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#2ECF8F]">
            {step.eyebrow}
          </p>

          <h2 className="text-3xl font-semibold leading-tight mt-3 max-w-[260px]">
            {step.title}
          </h2>

          <p className="text-sm text-white/80 mt-4 max-w-[290px] leading-6">
            {step.description}
          </p>
        </div>

        <div className="flex gap-2 mt-8">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setStepIndex(index)}
              className={cx(
                "h-2 rounded-full transition-all",
                index === stepIndex ? "w-8 bg-[#2ECF8F]" : "w-2 bg-white/30"
              )}
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="rounded-3xl bg-[#F4EFE8] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#0F3D3E]/55">
            Por que usar
          </p>

          <div className="space-y-3 mt-4">
            {[
              "Centralize clientes, agenda e vendas",
              "Tenha visão rápida do faturamento",
              "Reduza perda de tempo no WhatsApp",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-[#2ECF8F]/20 text-[#0F3D3E] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <p className="text-sm text-[#1E1E1E]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={nextStep}
            className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold shadow-md"
          >
            {stepIndex === onboardingSteps.length - 1 ? "Criar conta" : "Continuar"}
          </button>

          <button
            onClick={onLogin}
            className="w-full rounded-2xl border border-[#0F3D3E]/15 bg-white text-[#0F3D3E] py-3.5 text-sm font-semibold"
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}