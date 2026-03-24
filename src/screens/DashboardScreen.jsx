import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { PulsoMark } from "../components/brand/PulsoMark";
import { EmptyState } from "../components/ui/EmptyState";
import { quickActions } from "../data/constants";
import { formatCurrency } from "../utils/currency";
import { getInitials } from "../utils/initials";

function parseAppointmentDate(item) {
  if (!item?.date || !item?.time) return null;

  const [year, month, day] = String(item.date).split("-").map(Number);
  const [hours, minutes] = String(item.time).split(":").map(Number);

  const parsed = new Date(
    year,
    (month || 1) - 1,
    day || 1,
    hours || 0,
    minutes || 0,
    0,
    0
  );

  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

export function DashboardScreen({ db, onNavigate, onQuickAction }) {
  const now = new Date();

  const appointments = Array.isArray(db?.appointments) ? db.appointments : [];
  const sales = Array.isArray(db?.sales) ? db.sales : [];
  const clients = Array.isArray(db?.clients) ? db.clients : [];

  const normalizedAppointments = appointments
    .map((item) => ({
      ...item,
      parsedDate: parseAppointmentDate(item),
    }))
    .filter((item) => item.parsedDate)
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const upcomingAppointments = normalizedAppointments
    .filter((item) => item.parsedDate >= now)
    .slice(0, 3);

  const todayAppointments = normalizedAppointments.filter((item) =>
    isSameDay(item.parsedDate, now)
  );

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.amount || 0),
    0
  );

  const monthlySales = sales.reduce((sum, sale) => {
    if (!sale?.date) return sum;

    const saleDate = new Date(sale.date);
    if (Number.isNaN(saleDate.getTime())) return sum;

    return isSameMonth(saleDate, now)
      ? sum + Number(sale.amount || 0)
      : sum;
  }, 0);

  const activeClients = clients.filter(
    (client) => client.tag !== "Inativa"
  ).length;

  const dashboardActions = [
    { label: "Cliente", icon: "+", action: "new-client" },
    { label: "Venda", icon: "R$", action: "new-sale" },
    { label: "Agendamento", icon: "⏰", action: "new-appointment" },
  ];

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
            {getInitials(db?.user?.name || "Usuário")}
          </div>
        </div>

        <div className="mt-7">
          <p className="text-sm text-white/70">
            Bem-vindo, {db?.user?.name || "Usuário"}
          </p>
          <h2 className="text-3xl font-semibold leading-tight mt-2 max-w-[240px]">
            Seu negócio em ritmo certo.
          </h2>
          <p className="text-sm text-white/80 mt-3 max-w-[280px] leading-6">
            Veja compromissos, clientes e resultado financeiro em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/65">Faturamento total</p>
            <p className="text-2xl font-semibold mt-2">
              {formatCurrency(totalSales)}
            </p>
            <p className="text-xs text-[#2ECF8F] mt-2">vendas registradas</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/65">Clientes ativos</p>
            <p className="text-2xl font-semibold mt-2">{activeClients}</p>
            <p className="text-xs text-[#2ECF8F] mt-2">base em operação</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl bg-[#F4EFE8] p-4">
            <p className="text-xs text-[#1E1E1E]/55">Agendamentos hoje</p>
            <p className="text-2xl font-semibold text-[#1E1E1E] mt-2">
              {todayAppointments.length}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F4EFE8] p-4">
            <p className="text-xs text-[#1E1E1E]/55">Faturamento do mês</p>
            <p className="text-2xl font-semibold text-[#1E1E1E] mt-2">
              {formatCurrency(monthlySales)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1E1E1E]">Ações rápidas</h3>
          <button
            type="button"
            onClick={() => onNavigate("Agenda")}
            className="text-xs text-[#0F3D3E] font-medium"
          >
            Ver agenda
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {dashboardActions.map((action) => (
            <button
              key={action.label}
              type="button"
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
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1E1E1E]">
                  Próximos agendamentos
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigate("Agenda")}
                  className="text-xs text-[#0F3D3E] font-medium"
                >
                  Abrir agenda
                </button>
              </div>

              {upcomingAppointments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#0F3D3E]/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/60 mt-1">
                        {item.service}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/50 mt-2">
                        {item.date} às {item.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#0F3D3E]">
                        {formatCurrency(item.value)}
                      </p>
                      <p className="text-[11px] text-[#1E1E1E]/55 mt-1">
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum agendamento próximo"
              description="Crie seu primeiro agendamento para começar a organizar sua rotina."
              actionLabel="Criar agendamento"
              onAction={() => onQuickAction("new-appointment")}
            />
          )}
        </div>
      </div>
    </PhoneShell>
  );
}