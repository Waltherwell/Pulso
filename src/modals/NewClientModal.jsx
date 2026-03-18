import React from "react";
import { Modal } from "../components/ui/Modal";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function NewClientModal({ onClose, onSave }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    tag: "Nova",
  });

  function handleSave() {
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <Modal title="Novo cliente" onClose={onClose}>
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

        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold"
        >
          Salvar cliente
        </button>
      </div>
    </Modal>
  );
}