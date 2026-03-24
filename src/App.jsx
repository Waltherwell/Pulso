import { EditClientModal } from "./modals/EditClientModal";
import { EditAppointmentModal } from "./modals/EditAppointmentModal";
import React from "react";
import { supabase } from "./lib/supabase";
import { PulsoMark } from "./components/brand/PulsoMark";
import { RepositoryStatus } from "./components/ui/RepositoryStatus";

import { usePulsoDatabase } from "./hooks/usePulsoDatabase";

import { SignUpScreen } from "./screens/SignUpScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ClientsScreen } from "./screens/ClientsScreen";
import { AgendaScreen } from "./screens/AgendaScreen";
import { SalesScreen } from "./screens/SalesScreen";

import { NewClientModal } from "./modals/NewClientModal";
import { NewAppointmentModal } from "./modals/NewAppointmentModal";
import { NewSaleModal } from "./modals/NewSaleModal";
import { EditProfileModal } from "./modals/EditProfileModal";

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState("Onboarding");
  const [modal, setModal] = React.useState(null);

  const [selectedClient, setSelectedClient] = React.useState(null);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

  const [authError, setAuthError] = React.useState("");
  const [authSuccess, setAuthSuccess] = React.useState("");
  const [appError, setAppError] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState(false);

  const { db, isReady, syncMessage, repository, persist, resetDemo } =
    usePulsoDatabase();

  function SanityChecks({ db }) {
    const allGood =
      Array.isArray(db?.clients) &&
      Array.isArray(db?.appointments) &&
      Array.isArray(db?.sales);

    return <div className="hidden" data-sanity={allGood ? "ok" : "fail"} />;
  }

  React.useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setCurrentScreen("Onboarding");
        return;
      }

      if (data.session) {
        setCurrentScreen("Dashboard");
      } else {
        setCurrentScreen("Onboarding");
      }
    }

    bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session) {
        setCurrentScreen("Dashboard");
        setAuthError("");
        setAuthSuccess("");
        setAppError("");
      }

      if (event === "SIGNED_OUT") {
        setCurrentScreen("Onboarding");
        setAuthError("");
        setAuthSuccess("");
        setAppError("");
        setModal(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function updateDb(updater) {
    const next = typeof updater === "function" ? updater(db) : updater;
    persist(next);
  }

  async function handleLogout() {
    const confirmed = window.confirm("Deseja deslogar da PULSO?");
    if (!confirmed) return;

    setAppError("");
    await supabase.auth.signOut();
  }

  function openActionModal(action) {
    setAppError("");

    if (action === "new-client") {
      setModal("client");
      return;
    }

    if (action === "new-appointment") {
      setModal("appointment");
      return;
    }

    if (action === "new-sale") {
      setModal("sale");
      return;
    }

    if (action === "edit-profile") {
      setModal("profile");
    }
  }

  async function getOrCreateBusinessId() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Usuário não autenticado no Supabase.");
    }

    const fullName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Usuário";

    const businessName =
      user.user_metadata?.business_name ||
      "Meu Negócio";

    const slugBase = businessName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      phone: null,
    });

    if (profileError) {
      throw new Error(`Erro ao criar/atualizar perfil: ${profileError.message}`);
    }

    const { data: existingBusiness, error: readBusinessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_user_id", user.id)
      .limit(1);

    if (readBusinessError) {
      throw new Error(`Erro ao buscar negócio: ${readBusinessError.message}`);
    }

    const businessId = existingBusiness?.[0]?.id;
    if (businessId) {
      return businessId;
    }

    const { data: newBusiness, error: createBusinessError } = await supabase
      .from("businesses")
      .insert({
        owner_user_id: user.id,
        name: businessName,
        slug: `${slugBase || "negocio"}-${user.id.slice(0, 8)}`,
      })
      .select("id")
      .single();

    if (createBusinessError) {
      throw new Error(`Erro ao criar negócio: ${createBusinessError.message}`);
    }

    return newBusiness.id;
  }

  function openEditClient(client) {
    setAppError("");
    setSelectedClient(client);
    setModal("edit-client");
  }

  function openEditAppointment(appointment) {
    setAppError("");
    setSelectedAppointment(appointment);
    setModal("edit-appointment");
  }

  async function updateClient(form) {
    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.updateClient(selectedClient.id, form);
        const fresh = await repository.load();
        await persist(fresh);
        setModal(null);
        setSelectedClient(null);
        return true;
      }

      updateDb((current) => ({
        ...current,
        clients: current.clients.map((item) =>
          String(item.id) === String(selectedClient.id)
            ? { ...item, ...form }
            : item
        ),
      }));

      setModal(null);
      setSelectedClient(null);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar cliente.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateAppointment(form) {
    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.updateAppointment(selectedAppointment.id, form);
        const fresh = await repository.load();
        await persist(fresh);
        setModal(null);
        setSelectedAppointment(null);
        return true;
      }

      const client = db.clients.find(
        (item) => String(item.id) === String(form.clientId)
      );

      updateDb((current) => ({
        ...current,
        appointments: current.appointments.map((item) =>
          String(item.id) === String(selectedAppointment.id)
            ? {
              ...item,
              clientId: form.clientId,
              name: client?.name || "Cliente",
              service: form.service,
              date: form.date,
              time: form.time,
              value: Number(form.value || 0),
              status: form.status,
            }
            : item
        ),
      }));

      setModal(null);
      setSelectedAppointment(null);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar agendamento.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteAppointment(appointmentId) {
    const confirmed = window.confirm("Deseja deletar este agendamento?");
    if (!confirmed) return;

    if (actionLoading) return;

    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.deleteAppointment(appointmentId);
        const fresh = await repository.load();
        await persist(fresh);
        return true;
      }

      updateDb((current) => ({
        ...current,
        appointments: current.appointments.filter(
          (item) => String(item.id) !== String(appointmentId)
        ),
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar agendamento.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function ensureAccountSetup() {
    await getOrCreateBusinessId();
  }

  async function handleSupabaseLogin(email, password) {
    setAuthError("");
    setAuthSuccess("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    await ensureAccountSetup();
  }

  async function handleSupabaseSignUp(form) {
    if (actionLoading) return;
    setAuthError("");
    setAuthSuccess("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          business_name: form.businessName,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    const hasSession = Boolean(data.session);
    const userId = data.user?.id;

    if (!userId) {
      setAuthError("Não foi possível criar o usuário.");
      return;
    }

    if (!hasSession) {
      setAuthSuccess(
        "Conta criada. Confira seu email para confirmar o cadastro e depois entre no app."
      );
      setCurrentScreen("Login");
      return;
    }

    await ensureAccountSetup();
    setAuthSuccess("Conta criada com sucesso.");
    setCurrentScreen("Dashboard");
  }

  async function saveProfile(form) {
    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.updateProfile(form);
        const fresh = await repository.load();
        await persist(fresh);
        setModal(null);
        return true;
      }

      updateDb((current) => ({
        ...current,
        user: {
          ...current.user,
          name: form.name,
          email: form.email,
          phone: form.phone,
          businessName: form.businessName,
        },
      }));

      setModal(null);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar perfil.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function createClient(form) {
    if (actionLoading) return;
    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        const businessId = await getOrCreateBusinessId();
        await repository.createClient(businessId, form);
        const fresh = await repository.load();
        await persist(fresh);
        setModal(null);
        setCurrentScreen("Clientes");
        return true;
      }

      updateDb((current) => ({
        ...current,
        clients: [
          {
            id: Date.now(),
            name: form.name,
            phone: form.phone || "",
            tag: form.tag || "Nova",
            lastVisit: "ainda não atendido",
            spent: 0,
          },
          ...current.clients,
        ],
      }));

      setModal(null);
      setCurrentScreen("Clientes");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar cliente.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function createAppointment(form) {
    if (actionLoading) return;
    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        const businessId = await getOrCreateBusinessId();
        await repository.createAppointment(businessId, form);
        const fresh = await repository.load();
        await persist(fresh);
        setModal(null);
        setCurrentScreen("Agenda");
        return true;
      }

      const client = db.clients.find(
        (item) => String(item.id) === String(form.clientId)
      );

      updateDb((current) => ({
        ...current,
        appointments: [
          {
            id: Date.now(),
            clientId: form.clientId,
            name: client?.name || "Cliente",
            service: form.service,
            date: form.date,
            time: form.time,
            value: Number(form.value || 0),
            status: form.status,
          },
          ...current.appointments,
        ],
      }));

      setModal(null);
      setCurrentScreen("Agenda");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar agendamento.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function createSale(form) {
    if (actionLoading) return;

    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        const businessId = await getOrCreateBusinessId();
        await repository.createSale(businessId, form);
        const fresh = await repository.load();
        await persist(fresh);
        setModal(null);
        setCurrentScreen("Vendas");
        return true;
      }

      const client = db.clients.find(
        (item) => String(item.id) === String(form.clientId)
      );

      updateDb((current) => ({
        ...current,
        sales: [
          {
            id: Date.now(),
            clientId: form.clientId,
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
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar venda.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteClient(clientId) {
    const confirmed = window.confirm("Deseja deletar este cliente?");
    if (!confirmed) return;

    if (actionLoading) return;

    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.deleteClient(clientId);
        const fresh = await repository.load();
        await persist(fresh);
        return true;
      }

      updateDb((current) => ({
        ...current,
        clients: current.clients.filter(
          (item) => String(item.id) !== String(clientId)
        ),
        appointments: current.appointments.filter(
          (item) => String(item.clientId) !== String(clientId)
        ),
        sales: current.sales.filter(
          (item) => String(item.clientId) !== String(clientId)
        ),
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar cliente.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteAppointment(appointmentId) {
    const confirmed = window.confirm("Deseja deletar este agendamento?");
    if (!confirmed) return;

    if (actionLoading) return;

    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.deleteAppointment(appointmentId);
        const fresh = await repository.load();
        await persist(fresh);
        return true;
      }

      updateDb((current) => ({
        ...current,
        appointments: current.appointments.filter(
          (item) => String(item.id) !== String(appointmentId)
        ),
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar agendamento.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteSale(saleId) {
    const confirmed = window.confirm("Deseja deletar esta venda?");
    if (!confirmed) return;

    if (actionLoading) return;

    setAppError("");
    setActionLoading(true);

    try {
      if (repository.mode === "supabase") {
        await repository.deleteSale(saleId);
        const fresh = await repository.load();
        await persist(fresh);
        return true;
      }

      updateDb((current) => ({
        ...current,
        sales: current.sales.filter(
          (item) => String(item.id) !== String(saleId)
        ),
      }));

      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao deletar venda.";
      setAppError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  }

  function renderCurrentScreen() {
    if (currentScreen === "Onboarding") {
      return (
        <OnboardingScreen
          onSkip={() => setCurrentScreen("Login")}
          onLogin={() => setCurrentScreen("Login")}
          onCreateAccount={() => setCurrentScreen("SignUp")}
        />
      );
    }

    if (currentScreen === "SignUp") {
      return (
        <SignUpScreen
          onCreateAccount={handleSupabaseSignUp}
          authError={authError}
          authSuccess={authSuccess}
          onGoToLogin={() => setCurrentScreen("Login")}
        />
      );
    }

    if (currentScreen === "Login") {
      return (
        <LoginScreen
          onEnter={handleSupabaseLogin}
          authError={authError}
        />
      );
    }

    if (currentScreen === "Clientes") {
      return (
        <ClientsScreen
          db={db}
          onNavigate={setCurrentScreen}
          onCreateClient={() => setModal("client")}
          onDeleteClient={deleteClient}
          onEditClient={openEditClient}
        />
      );
    }

    if (currentScreen === "Agenda") {
      return (
        <AgendaScreen
          db={db}
          onNavigate={setCurrentScreen}
          onCreateAppointment={() => setModal("appointment")}
          onEditAppointment={openEditAppointment}
          onDeleteAppointment={deleteAppointment}
        />
      );
    }

    if (currentScreen === "Vendas") {
      return (
        <SalesScreen
          db={db}
          onNavigate={setCurrentScreen}
          onCreateSale={() => setModal("sale")}
          onDeleteSale={deleteSale}
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

  const isAuthenticatedArea =
    currentScreen === "Dashboard" ||
    currentScreen === "Clientes" ||
    currentScreen === "Agenda" ||
    currentScreen === "Vendas";

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
            Preparando a base do projeto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <SanityChecks db={db} />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <RepositoryStatus
              repository={repository}
              syncMessage={syncMessage}
              onReset={resetDemo}
            />
          </div>

          {isAuthenticatedArea ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal("profile")}
                className="rounded-2xl bg-white border border-[#0F3D3E]/10 px-4 py-3 text-sm font-semibold text-[#0F3D3E] shadow-sm"
              >
                Perfil
              </button>

              <button
                onClick={handleLogout}
                className="rounded-2xl bg-white border border-[#0F3D3E]/10 px-4 py-3 text-sm font-semibold text-[#0F3D3E] shadow-sm"
              >
                Deslogar
              </button>
            </div>
          ) : null}
        </div>

        {appError ? (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {appError}
          </div>
        ) : null}

        {actionLoading ? (
          <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            Processando ação...
          </div>
        ) : null}

        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-[#0F3D3E]/55">
            Protótipo navegável pronto para evoluir
          </p>
          <h1 className="text-3xl font-semibold text-[#1E1E1E] mt-3">
            PULSO
          </h1>
          <p className="text-sm text-[#1E1E1E]/60 mt-2">
            Base limpa, preparada para seguir no VS Code e depois subir para o GitHub.
          </p>
        </div>

        {renderCurrentScreen()}
      </div>

      {modal === "edit-client" && selectedClient ? (
        <EditClientModal
          client={selectedClient}
          onClose={() => {
            setModal(null);
            setSelectedClient(null);
          }}
          onSave={updateClient}
        />
      ) : null}

      {modal === "edit-appointment" && selectedAppointment ? (
        <EditAppointmentModal
          appointment={selectedAppointment}
          clients={db.clients}
          onClose={() => {
            setModal(null);
            setSelectedAppointment(null);
          }}
          onSave={updateAppointment}
        />
      ) : null}

      {modal === "profile" ? (
        <EditProfileModal
          user={db.user}
          onClose={() => setModal(null)}
          onSave={saveProfile}
        />
      ) : null}

      {modal === "client" ? (
        <NewClientModal
          onClose={() => setModal(null)}
          onSave={createClient}
        />
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