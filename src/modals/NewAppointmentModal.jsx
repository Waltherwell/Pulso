import React from "react";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/EmptyState";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function NewAppointmentModal({ clients, onClose, onSave }) {
  const [form, setForm] = React.useState({
    clientId: String(clients[0]?.id || ""),
    service: "",
    time: "09:00",
    value: "0",
    status: "Pendente",
  });

  function handleSave() {
    if (!form.service.trim()) return;
    onSave(form);
  }

  return (
    <Modal title="Novo agendamento" onClose={onClose}>
      {clients.length === 0 ? (
        <EmptyState
          title="Cadastre um cliente primeiro"
          description="Para criar um agendamento, você precisa ter pelo menos um cliente salvo na base."
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

          <Field label="Serviço">
            <Input
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              placeholder="Ex: Consulta inicial"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Hora">
              <Input
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="14:30"
              />
            </Field>

            <Field label="Valor">
              <Input
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="45"
              />
            </Field>
          </div>

          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Pendente</option>
              <option>Confirmado</option>
              <option>Em breve</option>
              <option>Concluído</option>
              <option>Cancelado</option>
            </Select>
          </Field>

          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-[#0F3D3E] text-white py-3.5 text-sm font-semibold"
          >
            Salvar agendamento
          </button>
        </div>
      )}
    </Modal>
  );
}