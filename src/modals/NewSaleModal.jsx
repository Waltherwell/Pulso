import React from "react";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function NewSaleModal({ clients, onClose, onSave }) {
  const [form, setForm] = React.useState({
    clientId: String(clients[0]?.id || ""),
    item: "",
    method: "Pix",
    amount: "0",
    time: "10:00",
  });

  function handleSave() {
    if (!form.item.trim()) return;
    onSave(form);
  }

  return (
    <Modal title="Nova venda" onClose={onClose}>
      {clients.length === 0 ? (
        <EmptyState
          title="Cadastre um cliente primeiro"
          description="Para registrar uma venda vinculada, você precisa ter pelo menos um cliente salvo na base."
        />
      ) : (
        <div className="space-y-4">
          <Field label="Cliente">
            <Select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Item vendido">
            <Input
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              placeholder="Ex: Serviço principal"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Pagamento">
              <Select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option>Pix</option>
                <option>Cartão</option>
                <option>Dinheiro</option>
              </Select>
            </Field>

            <Field label="Valor">
              <Input
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="60"
              />
            </Field>
          </div>

          <Field label="Hora">
            <Input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              placeholder="10:00"
            />
          </Field>

          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold"
          >
            Salvar venda
          </button>
        </div>
      )}
    </Modal>
  );
}