import React from "react";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

function getNowTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function NewSaleModal({ clients, onClose, onSave }) {
  const [form, setForm] = React.useState({
    clientId: String(clients[0]?.id || ""),
    item: "",
    method: "Pix",
    amount: "0",
    time: getNowTime(),
  });

  const [localError, setLocalError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSave() {
    setLocalError("");

    if (!form.clientId) {
      setLocalError("Selecione um cliente.");
      return;
    }

    if (!form.item.trim()) {
      setLocalError("Informe o item ou serviço.");
      return;
    }

    setLoading(true);

    try {
      await onSave(form);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Erro ao salvar venda."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Nova venda" onClose={onClose}>
      {clients.length === 0 ? (
        <EmptyState
          title="Cadastre um cliente primeiro"
          description="Para registrar uma venda, você precisa ter pelo menos um cliente salvo."
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

          <Field label="Item ou serviço">
            <Input
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              placeholder="Ex: design de sobrancelha"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Forma de pagamento">
              <Select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option>Pix</option>
                <option>Cartão</option>
                <option>Dinheiro</option>
                <option>Boleto</option>
              </Select>
            </Field>

            <Field label="Valor">
              <Input
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
              />
            </Field>
          </div>

          <Field label="Horário">
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </Field>

          {localError ? (
            <div className="rounded-2xl bg-[#F4EFE8] border border-[#0F3D3E]/10 px-4 py-3 text-sm text-[#0F3D3E]">
              {localError}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold shadow-sm disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar venda"}
          </button>
        </div>
      )}
    </Modal>
  );
}