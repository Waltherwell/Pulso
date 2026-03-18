import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { FilterPills } from "../components/ui/FilterPills";
import { EmptyState } from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";
import { getInitials } from "../utils/initials";
import { cx } from "../utils/cx";
import { tagStyles } from "../data/constants";

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
        onClick={onCreate}
        className="w-11 h-11 rounded-2xl bg-[#0F3D3E] text-white text-xl leading-none shadow-md"
      >
        +
      </button>
    </div>
  );
}

export function ClientsScreen({ db, onNavigate, onCreateClient }) {
  const [filter, setFilter] = React.useState("Todos");
  const [query, setQuery] = React.useState("");

  const filteredClients = db.clients.filter((client) => {
    const matchesFilter = filter === "Todos" ? true : client.tag === filter;
    const phone = String(client.phone || "");
    const matchesQuery =
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      phone.includes(query);

    return matchesFilter && matchesQuery;
  });

  return (
    <PhoneShell activeTab="Clientes" showNav={true} onNavigate={onNavigate}>
      <div className="bg-white px-6 pt-7 pb-5 border-b border-[#0F3D3E]/8">
        <ScreenHeader title="Clientes" onCreate={onCreateClient} />

        <div className="mt-5 rounded-2xl bg-[#F4EFE8] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-[#0F3D3E] text-sm">
            ⌕
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou telefone"
            className="bg-transparent outline-none text-sm text-[#1E1E1E] flex-1"
          />
        </div>

        <FilterPills
          items={["Todos", "Nova", "Recorrente", "VIP", "Inativa"]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      <div className="px-6 py-5">
        <div className="rounded-3xl bg-[#F4EFE8] p-4 mb-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#0F3D3E]/55">
            Resumo
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div>
              <p className="text-xl font-semibold text-[#1E1E1E]">
                {db.clients.length}
              </p>
              <p className="text-[11px] text-[#1E1E1E]/55 mt-1">Total</p>
            </div>

            <div>
              <p className="text-xl font-semibold text-[#1E1E1E]">
                {db.clients.filter((item) => item.tag === "Recorrente").length}
              </p>
              <p className="text-[11px] text-[#1E1E1E]/55 mt-1">Recorrentes</p>
            </div>

            <div>
              <p className="text-xl font-semibold text-[#1E1E1E]">
                {db.clients.filter((item) => item.tag === "Inativa").length}
              </p>
              <p className="text-[11px] text-[#1E1E1E]/55 mt-1">Inativos</p>
            </div>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <EmptyState
            title="Nenhum cliente cadastrado"
            description="Cadastre seu primeiro cliente para começar a montar seu relacionamento e histórico de atendimento."
            actionLabel="Cadastrar cliente"
            onAction={onCreateClient}
          />
        ) : (
          <div className="space-y-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl border border-[#0F3D3E]/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F4EFE8] flex items-center justify-center text-[#0F3D3E] text-xs font-semibold">
                      {getInitials(client.name)}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">
                        {client.name}
                      </p>
                      <p className="text-xs text-[#1E1E1E]/55 mt-1">
                        Última visita {client.lastVisit}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cx(
                      "text-[11px] px-2.5 py-1 rounded-full font-medium",
                      tagStyles[client.tag]
                    )}
                  >
                    {client.tag}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F4EFE8] px-4 py-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#1E1E1E]/45">
                      Valor gerado
                    </p>
                    <p className="text-sm font-semibold text-[#0F3D3E] mt-1">
                      {formatCurrency(client.spent)}
                    </p>
                  </div>

                  <button className="text-xs font-medium text-[#0F3D3E]">
                    {client.phone || "Sem telefone"}
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