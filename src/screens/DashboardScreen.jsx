import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { EmptyState } from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";

function parseAppointmentDate(item) {
  if (!item?.date) return null;

  const [year, month, day] = String(item.date).split("-").map(Number);
  const [hours, minutes] = String(item.time || "09:00")
    .split(":")
    .map(Number);

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

function StatCard({ label, value, caption }) {
  return (
    <div className="rounded-2xl bg-white border border-[#0F3D3E]/10 p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[#0F3D3E]/50">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#0F3D3E] mt-2">{value}</p>
      {caption ? (
        <p className="text-xs text-[#0F3D3E]/55 mt-2">{caption}</p>
      ) : null}
    </div>
  );
}

function QuickActionButton({ label, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-[#F4EFE8] border border-[#0F3D3E]/10 p-4 flex flex-col items-center justify-center text-center active:scale-[0.98] transition"
    >
      <div className="w-11 h-11 rounded-2xl bg-[#0F3D3E] text-white flex items-center justify-center text-base font-semibold shadow-sm">
        {icon}
      </div>
      <span className="text-[11px] leading-4 text-[#0F3D3E] mt-3 font-medium">
        {label}
      </span>
    </button>
  );
}

export function DashboardScreen({ db, onNavigate, onQuickAction }) {
  const appointments = Array.isArray(db?.appointments) ? db.appointments : [];
  const sales = Array.isArray(db?.sales) ? db.sales : [];
  const clients = Array.isArray(db?.clients) ? db.clients : [];

  const now = new Date();

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

  const activeClients = clients.filter((client) => client?.tag !== "Inativa").length;

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale?.amount || 0),
    0
  );

  const appointmentsValueToday = todayAppointments.reduce(
    (sum, item) => sum + Number(item?.value || 0),
    0
  );

  return (
    <PhoneShell activeTab="Dashboard" showNav={true} onNavigate={onNavigate}>
      <div className="px-6 pt-7 pb-6 bg-white border-b border-[#0F3D3E]/8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#0F3D3E]/55">
          Dashboard
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F3D3E] mt-3">
          Seu negócio em ritmo certo
        </h2>

        <p className="text-sm text-[#0F3D3E]/65 mt-3 max-w-[320px] leading-6">
          Veja compromissos, clientes e resultado financeiro em uma visão simples e objetiva.
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Receita total"
            value={formatCurrency(totalRevenue)}
            caption="vendas registradas"
          />

          <StatCard
            label="Clientes ativos"
            value={String(activeClients)}
            caption="base em operação"
          />

          <StatCard
            label="Hoje"
            value={String(todayAppointments.length)}
            caption="agendamentos do dia"
          />

          <StatCard
            label="Previsto hoje"
            value={formatCurrency(appointmentsValueToday)}
            caption="valor da agenda"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0F3D3E]">
              Ações rápidas
            </h3>

            <button
              type="button"
              onClick={() => onNavigate("Agenda")}
              className="text-xs font-medium text-[#0F3D3E]/70"
            >
              Abrir agenda
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            <QuickActionButton
              label="Cliente"
              icon="+"
              onClick={() => onQuickAction("new-client")}
            />

            <QuickActionButton
              label="Venda"
              icon="R$"
              onClick={() => onQuickAction("new-sale")}
            />

            <QuickActionButton
              label="Agenda"
              icon="⏰"
              onClick={() => onQuickAction("new-appointment")}
            />
          </div>
        </div>

        <div className="mt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0F3D3E]">
                  Próximos agendamentos
                </h3>

                <button
                  type="button"
                  onClick={() => onNavigate("Agenda")}
                  className="text-xs font-medium text-[#0F3D3E]/70"
                >
                  Ver todos
                </button>
              </div>

              {upcomingAppointments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-[#0F3D3E]/10 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#0F3D3E]">
                        {item.name || "Cliente"}
                      </p>
                      <p className="text-xs text-[#0F3D3E]/60 mt-1">
                        {item.service || "Serviço"}
                      </p>
                      <p className="text-xs text-[#0F3D3E]/50 mt-2">
                        {item.date} às {item.time || "--:--"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#0F3D3E]">
                        {formatCurrency(item.value || 0)}
                      </p>
                      <p className="text-[11px] text-[#0F3D3E]/55 mt-1">
                        {item.status || "Pendente"}
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

        <div className="mt-6">
          <div className="rounded-2xl bg-[#0F3D3E] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Resumo operacional
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div>
                <p className="text-xl font-semibold">{clients.length}</p>
                <p className="text-[11px] text-white/60 mt-1">Clientes</p>
              </div>

              <div>
                <p className="text-xl font-semibold">{appointments.length}</p>
                <p className="text-[11px] text-white/60 mt-1">Agenda</p>
              </div>

              <div>
                <p className="text-xl font-semibold">{sales.length}</p>
                <p className="text-[11px] text-white/60 mt-1">Vendas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}