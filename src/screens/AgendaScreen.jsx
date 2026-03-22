import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { FilterPills } from "../components/ui/FilterPills";
import { EmptyState } from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";
import { cx } from "../utils/cx";
import { appointmentStatusStyles } from "../data/constants";

function ScreenHeader({ title, onCreate }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#0F3D3E]/55">
          PULSO
        </p>
        <h2 className="text-2xl font-semibold text-[#1E1E1E] mt-2">{title}</h2>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="w-11 h-11 rounded-2xl bg-[#0F3D3E] text-white text-xl leading-none shadow-md"
      >
        +
      </button>
    </div>
  );
}

export function AgendaScreen({
  db,
  onNavigate,
  onCreateAppointment,
  onEditAppointment,
  onDeleteAppointment,
}) {
  const [filter, setFilter] = React.useState("Hoje");
  const appointments = Array.isArray(db?.appointments) ? db.appointments : [];

  return (
    <PhoneShell activeTab="Agenda" showNav={true} onNavigate={onNavigate}>
      <div className="bg-white px-6 pt-7 pb-5 border-b border-[#0F3D3E]/8">
        <ScreenHeader title="Agenda" onCreate={onCreateAppointment} />

        <div className="mt-5 rounded-3xl bg-[#0F3D3E] p-4 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            {filter}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div>
              <p className="text-xl font-semibold">{appointments.length}</p>
              <p className="text-[11px] text-white/60 mt-1">Agendados</p>
            </div>

            <div>
              <p className="text-xl font-semibold">
                {formatCurrency(
                  appointments.reduce(
                    (sum, item) => sum + Number(item?.value || 0),
                    0
                  )
                )}
              </p>
              <p className="text-[11px] text-white/60 mt-1">Previsto</p>
            </div>

            <div>
              <p className="text-xl font-semibold">
                {
                  appointments.filter((item) => item?.status === "Pendente")
                    .length
                }
              </p>
              <p className="text-[11px] text-white/60 mt-1">Pendente</p>
            </div>
          </div>
        </div>

        <FilterPills
          items={["Hoje", "Amanhã", "Semana"]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      <div className="px-6 py-5">
        {appointments.length === 0 ? (
          <EmptyState
            title="Sua agenda está vazia"
            description="Crie seu primeiro compromisso para visualizar seus atendimentos e manter sua rotina organizada."
            actionLabel="Novo agendamento"
            onAction={onCreateAppointment}
          />
        ) : (
          <div className="space-y-3">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#0F3D3E]/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F4EFE8] flex flex-col items-center justify-center text-[#0F3D3E]">
                      <span className="text-[10px] uppercase tracking-wide">
                        Hora
                      </span>
                      <span className="text-xs font-semibold mt-0.5">
                        {item?.time || "--:--"}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {item?.name || "Cliente"}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/60 mt-1">
                        {item?.service || "Serviço"}
                      </p>
                      <p className="text-sm font-semibold text-[#0F3D3E] mt-2">
                        {formatCurrency(item?.value || 0)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={cx(
                      "text-[11px] px-2.5 py-1 rounded-full font-medium",
                      appointmentStatusStyles[item?.status] ||
                      "bg-[#F4EFE8] text-[#0F3D3E]"
                    )}
                  >
                    {item?.status || "Pendente"}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEditAppointment(item)}
                    className="rounded-xl border border-[#0F3D3E]/10 px-3 py-2 text-xs font-semibold text-[#0F3D3E] bg-white"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAppointment(item.id)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 bg-white"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PhoneShell>
  );
}