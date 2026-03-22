import React from "react";
import { Modal } from "../components/ui/Modal";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function EditClientModal({ client, onClose, onSave }) {
  const [form, setForm] = React.useState({
    name: client?.name || "",
    phone: client?.phone || "",
    tag: client?.tag || "Nova",
  });

  const [localError, setLocalError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSave() {
    setLocalError("");

    if (!form.name.trim()) {
      setLocalError("Informe o nome do cliente.");
      return;
    }

    setLoading(true);

    try {
      await onSave(form);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Erro ao salvar cliente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Editar cliente" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Nome">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome completo"
          />
        </Field>

        <Field label="Telefone">
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </Field>

        <Field label="Categoria">
          <Select
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
          >
            <option>Nova</option>
            <option>Recorrente</option>
            <option>VIP</option>
            <option>Inativa</option>
          </Select>
        </Field>

        {localError ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {localError}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </Modal>
  );
}