import React from "react";
import { Modal } from "../components/ui/Modal";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";

export function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    businessName: user?.businessName || "",
  });

  const [localError, setLocalError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSave() {
    setLocalError("");

    if (!form.name.trim()) {
      setLocalError("Informe seu nome.");
      return;
    }

    if (!form.businessName.trim()) {
      setLocalError("Informe o nome do negócio.");
      return;
    }

    setLoading(true);

    try {
      await onSave(form);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Erro ao salvar perfil."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Perfil e dados do negócio" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Seu nome">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Seu nome"
          />
        </Field>

        <Field label="Email de login">
          <Input value={form.email} disabled className="opacity-70 cursor-not-allowed" />
        </Field>

        <Field label="Telefone">
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </Field>

        <Field label="Nome do negócio">
          <Input
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
            placeholder="Nome do negócio"
          />
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