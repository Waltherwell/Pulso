import React from "react";
import { Modal } from "../components/ui/Modal";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function EditAppointmentModal({
  appointment,
  clients,
  onClose,
  onSave,
}) {
  const [form, setForm] = React.useState({
    clientId: String(appointment?.clientId || ""),
    service: appointment?.service || "",
    date: appointment?.date || getToday(),
    time: appointment?.time || "09:00",
    value: String(appointment?.value || 0),
    status: appointment?.status || "Pendente",
  });

  const [localError, setLocalError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSave() {
    setLocalError("");

    if (!form.clientId) {
      setLocalError("Selecione um cliente.");
      return;
    }

    if (!form.service.trim()) {
      setLocalError("Informe o serviço.");
      return;
    }

    if (!form.date) {
      setLocalError("Informe a data.");
      return;
    }

    setLoading(true);

    try {
      await onSave(form);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Erro ao salvar agendamento."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Editar agendamento" onClose={onClose}>
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
            placeholder="Serviço"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>

          <Field label="Hora">
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor">
            <Input
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="0"
            />
          </Field>

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
        </div>

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
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </Modal>
  );
}