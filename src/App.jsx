import React from "react";
import { PulsoMark } from "./components/brand/PulsoMark";
import { RepositoryStatus } from "./components/ui/RepositoryStatus";

import { usePulsoDatabase } from "./hooks/usePulsoDatabase";

import { OnboardingScreen } from "./screens/OnboardingScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ClientsScreen } from "./screens/ClientsScreen";
import { AgendaScreen } from "./screens/AgendaScreen";
import { SalesScreen } from "./screens/SalesScreen";

import { NewClientModal } from "./modals/NewClientModal";
import { NewAppointmentModal } from "./modals/NewAppointmentModal";
import { NewSaleModal } from "./modals/NewSaleModal";

function SanityChecks({ db }) {
  const allGood =
    Array.isArray(db.clients) &&
    Array.isArray(db.appointments) &&
    Array.isArray(db.sales);

  return <div className="hidden" data-sanity={allGood ? "ok" : "fail"} />;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState("Onboarding");
  const [modal, setModal] = React.useState(null);

  const { db, isReady, syncMessage, repository, persist, resetDemo } =
    usePulsoDatabase();

  function updateDb(updater) {
    const next = typeof updater === "function" ? updater(db) : updater;
    persist(next);
  }

  function openActionModal(action) {
    if (action === "new-client") setModal("client");
    if (action === "new-appointment") setModal("appointment");
    if (action === "new-sale") setModal("sale");
  }

  function createClient(form) {
    updateDb((current) => ({
      ...current,
      clients: [
        {
          id: Date.now(),
          name: form.name,
          phone: form.phone,
          tag: form.tag,
          lastVisit: "ainda não atendido",
          spent: 0,
        },
        ...current.clients,
      ],
    }));

    setModal(null);
    setCurrentScreen("Clientes");
  }

  function createAppointment(form) {
    const client = db.clients.find(
      (item) => String(item.id) === String(form.clientId)
    );

    updateDb((current) => ({
      ...current,
      appointments: [
        {
          id: Date.now(),
          clientId: Number(form.clientId),
          name: client?.name || "Cliente",
          service: form.service,
          time: form.time,
          value: Number(form.value || 0),
          status: form.status,
        },
        ...current.appointments,
      ],
    }));

    setModal(null);
    setCurrentScreen("Agenda");
  }

  function createSale(form) {
    const client = db.clients.find(
      (item) => String(item.id) === String(form.clientId)
    );

    updateDb((current) => ({
      ...current,
      sales: [
        {
          id: Date.now(),
          clientId: Number(form.clientId),
          client: client?.name || "Cliente",
          item: form.item,
          method: form.method,
          amount: Number(form.amount || 0),
          time: form.time,
        },
        ...current.sales,
      ],
      clients: current.clients.map((item) => {
        if (String(item.id) !== String(form.clientId)) return item;

        return {
          ...item,
          spent: Number(item.spent || 0) + Number(form.amount || 0),
          lastVisit: "hoje",
          tag: item.tag === "Nova" ? "Recorrente" : item.tag,
        };
      }),
    }));

    setModal(null);
    setCurrentScreen("Vendas");
  }

  function renderCurrentScreen() {
    if (currentScreen === "Onboarding") {
      return (
        <OnboardingScreen
          onSkip={() => setCurrentScreen("Login")}
          onLogin={() => setCurrentScreen("Login")}
          onCreateAccount={() => setCurrentScreen("Login")}
        />
      );
    }

    if (currentScreen === "Login") {
      return <LoginScreen onEnter={() => setCurrentScreen("Dashboard")} />;
    }

    if (currentScreen === "Clientes") {
      return (
        <ClientsScreen
          db={db}
          onNavigate={setCurrentScreen}
          onCreateClient={() => setModal("client")}
        />
      );
    }

    if (currentScreen === "Agenda") {
      return (
        <AgendaScreen
          db={db}
          onNavigate={setCurrentScreen}
          onCreateAppointment={() => setModal("appointment")}
        />
      );
    }

    if (currentScreen === "Vendas") {
      return (
        <SalesScreen
          db={db}
          onNavigate={setCurrentScreen}
          onCreateSale={() => setModal("sale")}
        />
      );
    }

    return (
      <DashboardScreen
        db={db}
        onNavigate={setCurrentScreen}
        onQuickAction={openActionModal}
      />
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#F4EFE8] p-6 flex items-center justify-center">
        <div className="rounded-[30px] bg-white shadow-xl border border-black/5 px-8 py-10 text-center max-w-sm w-full">
          <div className="flex items-center justify-center mb-4">
            <PulsoMark />
          </div>
          <h2 className="text-xl font-semibold text-[#1E1E1E]">
            Inicializando PULSO
          </h2>
          <p className="text-sm text-[#1E1E1E]/60 mt-2">
            Preparando a base local do projeto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <SanityChecks db={db} />

      <div className="max-w-6xl mx-auto">
        <RepositoryStatus
          repository={repository}
          syncMessage={syncMessage}
          onReset={resetDemo}
        />

        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#0F3D3E]/55">
            Protótipo navegável pronto para evoluir
          </p>
          <h1 className="text-3xl font-semibold text-[#1E1E1E] mt-3">
            PULSO
          </h1>
          <p className="text-sm text-[#1E1E1E]/60 mt-2">
            Base limpa, sem dados fictícios, preparada para continuar no VS Code
            e depois subir para o GitHub.
          </p>
        </div>

        {renderCurrentScreen()}
      </div>

      {modal === "client" ? (
        <NewClientModal onClose={() => setModal(null)} onSave={createClient} />
      ) : null}

      {modal === "appointment" ? (
        <NewAppointmentModal
          clients={db.clients}
          onClose={() => setModal(null)}
          onSave={createAppointment}
        />
      ) : null}

      {modal === "sale" ? (
        <NewSaleModal
          clients={db.clients}
          onClose={() => setModal(null)}
          onSave={createSale}
        />
      ) : null}
    </div>
  );
}