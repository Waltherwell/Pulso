import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { PulsoMark } from "../components/brand/PulsoMark";
import { EmptyState } from "../components/ui/EmptyState";
import { quickActions } from "../data/constants";
import { formatCurrency } from "../utils/currency";
import { getInitials } from "../utils/initials";

export function DashboardScreen({ db, onNavigate, onQuickAction }) {
  const totalSales = db.sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
  const activeClients = db.clients.filter((client) => client.tag !== "Inativa").length;
  const nextAppointment = db.appointments[0] || null;

  return (
    <PhoneShell activeTab="Dashboard" showNav={true} onNavigate={onNavigate}>
      <div className="bg-[#0F3D3E] px-6 pt-7 pb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PulsoMark dark={true} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">
                PULSO
              </p>
              <h1 className="text-base font-semibold mt-1">Dashboard</h1>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-sm font-semibold">
            {getInitials(db.user.name)}
          </div>
        </div>

        <div className="mt-7">
          <p className="text-sm text-white/70">Bem-vindo, {db.user.name}</p>
          <h2 className="text-3xl font-semibold leading-tight mt-2 max-w-[240px]">
            Controle sua operação com clareza.
          </h2>
          <p className="text-sm text-white/80 mt-3 max-w-[280px] leading-6">
            Clientes, agenda e vendas organizados em um fluxo simples e confiável.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/65">Faturamento</p>
            <p className="text-2xl font-semibold mt-2">
              {formatCurrency(totalSales)}
            </p>
            <p className="text-xs text-[#2ECF8F] mt-2">total registrado</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/65">Clientes ativos</p>
            <p className="text-2xl font-semibold mt-2">{activeClients}</p>
            <p className="text-xs text-[#2ECF8F] mt-2">clientes cadastrados</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1E1E1E]">Ações rápidas</h3>
          <button
            onClick={() => onNavigate("Clientes")}
            className="text-xs text-[#0F3D3E] font-medium"
          >
            Abrir CRM
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onQuickAction(action.action)}
              className="rounded-2xl bg-[#F4EFE8] p-4 flex flex-col items-center justify-center text-center active:scale-[0.98] transition"
            >
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#0F3D3E] font-semibold shadow-sm">
                {action.icon}
              </div>
              <span className="text-[11px] leading-4 text-[#1E1E1E] mt-3 font-medium">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {nextAppointment ? (
            <div className="rounded-3xl bg-[#F4EFE8] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1E1E1E]">
                    Próximo atendimento
                  </p>
                  <p className="text-xs text-[#1E1E1E]/60 mt-1">
                    Hoje, {nextAppointment.time}
                  </p>
                </div>

                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#2ECF8F]/20 text-[#0F3D3E] font-medium">
                  {nextAppointment.status}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-white px-4 py-3 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E]">
                    {nextAppointment.name}
                  </p>
                  <p className="text-xs text-[#1E1E1E]/60 mt-1">
                    {nextAppointment.service}
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#0F3D3E]">
                  {formatCurrency(nextAppointment.value)}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Nenhum agendamento ainda"
              description="Crie seu primeiro agendamento para começar a organizar sua rotina dentro da PULSO."
              actionLabel="Criar agendamento"
              onAction={() => onQuickAction("new-appointment")}
            />
          )}
        </div>
      </div>
    </PhoneShell>
  );
}