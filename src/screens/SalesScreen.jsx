import React from "react";
import { PhoneShell } from "../components/layout/PhoneShell";
import { FilterPills } from "../components/ui/FilterPills";
import { EmptyState } from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";

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

export function SalesScreen({ db, onNavigate, onCreateSale }) {
  const [filter, setFilter] = React.useState("Hoje");

  const totalSales = db.sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
  const pixSales = db.sales
    .filter((item) => item.method === "Pix")
    .reduce((sum, sale) => sum + Number(sale.amount || 0), 0);

  const cardSales = db.sales
    .filter((item) => item.method === "Cartão")
    .reduce((sum, sale) => sum + Number(sale.amount || 0), 0);

  return (
    <PhoneShell activeTab="Vendas" showNav={true} onNavigate={onNavigate}>
      <div className="bg-white px-6 pt-7 pb-5 border-b border-[#0F3D3E]/8">
        <ScreenHeader title="Vendas" onCreate={onCreateSale} />

        <div className="mt-5 rounded-3xl bg-[#0F3D3E] p-4 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            {filter}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div>
              <p className="text-xl font-semibold">{formatCurrency(totalSales)}</p>
              <p className="text-[11px] text-white/60 mt-1">Entrada</p>
            </div>

            <div>
              <p className="text-xl font-semibold">{db.sales.length}</p>
              <p className="text-[11px] text-white/60 mt-1">Vendas</p>
            </div>

            <div>
              <p className="text-xl font-semibold">
                {db.sales.length
                  ? formatCurrency(totalSales / db.sales.length)
                  : formatCurrency(0)}
              </p>
              <p className="text-[11px] text-white/60 mt-1">Ticket médio</p>
            </div>
          </div>
        </div>

        <FilterPills
          items={["Hoje", "Semana", "Mês"]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      <div className="px-6 py-5">
        <div className="rounded-3xl bg-[#F4EFE8] p-4 mb-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#0F3D3E]/55">
            Resumo financeiro
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-[11px] text-[#1E1E1E]/50">Pix</p>
              <p className="text-lg font-semibold text-[#0F3D3E] mt-1">
                {formatCurrency(pixSales)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <p className="text-[11px] text-[#1E1E1E]/50">Cartão</p>
              <p className="text-lg font-semibold text-[#0F3D3E] mt-1">
                {formatCurrency(cardSales)}
              </p>
            </div>
          </div>
        </div>

        {db.sales.length === 0 ? (
          <EmptyState
            title="Nenhuma venda registrada"
            description="Registre sua primeira venda para acompanhar faturamento, ticket médio e forma de pagamento."
            actionLabel="Nova venda"
            onAction={onCreateSale}
          />
        ) : (
          <div className="space-y-3">
            {db.sales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-2xl border border-[#0F3D3E]/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#1E1E1E]">
                      {sale.client}
                    </p>
                    <p className="text-xs text-[#1E1E1E]/60 mt-1">{sale.item}</p>
                  </div>

                  <p className="text-sm font-semibold text-[#0F3D3E]">
                    {formatCurrency(sale.amount)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F4EFE8] px-4 py-3 text-xs">
                  <span className="text-[#1E1E1E]/65">{sale.method}</span>
                  <span className="text-[#1E1E1E]/65">{sale.time}</span>
                  <button className="font-medium text-[#0F3D3E]">Detalhes</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PhoneShell>
  );
}