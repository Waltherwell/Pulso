import { supabase } from "../lib/supabase";
import { createInitialDb } from "../data/initialDb";

function formatTime(value) {
  const date = value ? new Date(value) : null;

  return date
    ? date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "--:--";
}

function mapClient(row) {
  return {
    id: row?.id ?? crypto.randomUUID(),
    name: String(row?.name || "Cliente sem nome"),
    phone: String(row?.phone || ""),
    tag: String(row?.tag || "Nova"),
    lastVisit: row?.last_visit_at ? "com histórico" : "sem histórico",
    spent: Number(row?.total_spent || 0),
  };
}

function mapAppointment(row, clientsMap) {
  return {
    id: row.id,
    clientId: row.client_id,
    name: clientsMap.get(String(row.client_id))?.name || "Cliente",
    service: row.notes || "Serviço",
    time: formatTime(row.scheduled_start),
    value: Number(row.price || 0),
    status: row.status || "Pendente",
  };
}

function mapSale(row, clientsMap) {
  return {
    id: row.id,
    clientId: row.client_id,
    client: clientsMap.get(String(row.client_id))?.name || "Cliente",
    item: row.notes || "Venda",
    method: row.payment_method,
    amount: Number(row.total_amount || 0),
    time: formatTime(row.sale_date),
  };
}

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Usuário não autenticado.");
  }

  return user;
}

export function createSupabaseRepository() {
  return {
    name: "Supabase",
    mode: "supabase",

    async updateClient(clientId, form) {
      const payload = {
        name: form.name,
        phone: form.phone || null,
        tag: form.tag || "Nova",
      };

      const { data, error } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", clientId)
        .select("*")
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar cliente: ${error.message}`);
      }

      return mapClient(data);
    },

    async updateAppointment(appointmentId, form) {
      const now = new Date();
      const [hours, minutes] = String(form.time || "09:00").split(":");
      now.setHours(Number(hours), Number(minutes), 0, 0);

      const payload = {
        client_id: form.clientId,
        scheduled_start: now.toISOString(),
        status: form.status || "Pendente",
        price: Number(form.value || 0),
        notes: form.service || null,
      };

      const { data, error } = await supabase
        .from("appointments")
        .update(payload)
        .eq("id", appointmentId)
        .select("*")
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar agendamento: ${error.message}`);
      }

      return data;
    },

    async deleteAppointment(appointmentId) {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId);

      if (error) {
        throw new Error(`Erro ao deletar agendamento: ${error.message}`);
      }

      return true;
    },

    async load() {
      const user = await getCurrentUser();

      const { data: businesses, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_user_id", user.id)
        .limit(1);

      if (businessError) {
        throw new Error(`Erro ao buscar negócio: ${businessError.message}`);
      }

      const business = businesses?.[0];

      if (!business) {
        return {
          ...createInitialDb(),
          user: {
            name: user.user_metadata?.full_name || user.email || "Usuário",
            email: user.email || "",
            phone: "",
            businessName: "Meu Negócio",
          },
        };
      }

      const [clientsRes, appointmentsRes, salesRes, profileRes] =
        await Promise.all([
          supabase
            .from("clients")
            .select("*")
            .eq("business_id", business.id)
            .order("created_at", { ascending: false }),

          supabase
            .from("appointments")
            .select("*")
            .eq("business_id", business.id)
            .order("scheduled_start", { ascending: true }),

          supabase
            .from("sales")
            .select("*")
            .eq("business_id", business.id)
            .order("sale_date", { ascending: false }),

          supabase.from("profiles").select("*").eq("id", user.id).single(),
        ]);

      if (clientsRes.error) {
        throw new Error(`Erro ao buscar clientes: ${clientsRes.error.message}`);
      }

      if (appointmentsRes.error) {
        throw new Error(
          `Erro ao buscar agendamentos: ${appointmentsRes.error.message}`
        );
      }

      if (salesRes.error) {
        throw new Error(`Erro ao buscar vendas: ${salesRes.error.message}`);
      }

      if (profileRes.error && profileRes.error.code !== "PGRST116") {
        throw new Error(`Erro ao buscar perfil: ${profileRes.error.message}`);
      }

      const mappedClients = (clientsRes.data || []).map(mapClient);
      const clientsMap = new Map(
        mappedClients.map((client) => [String(client.id), client])
      );

      return {
        user: {
          name:
            profileRes.data?.full_name ||
            user.user_metadata?.full_name ||
            user.email ||
            "Usuário",
          email: user.email || "",
          phone: profileRes.data?.phone || "",
          businessName: business.name || "Meu Negócio",
        },
        clients: mappedClients,
        appointments: (appointmentsRes.data || []).map((item) =>
          mapAppointment(item, clientsMap)
        ),
        sales: (salesRes.data || []).map((item) => mapSale(item, clientsMap)),
      };
    },

    async save(db) {
      return db;
    },

    async reset() {
      throw new Error("Reset não disponível no modo Supabase.");
    },

    async createClient(businessId, form) {
      const payload = {
        business_id: businessId,
        name: form.name,
        phone: form.phone || null,
        tag: form.tag || "Nova",
      };

      const { data, error } = await supabase
        .from("clients")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw new Error(`Erro ao criar cliente: ${error.message}`);
      }

      return mapClient(data);
    },

    async deleteClient(clientId) {
      const { error: appointmentsError } = await supabase
        .from("appointments")
        .delete()
        .eq("client_id", clientId);

      if (appointmentsError) {
        throw new Error(
          `Erro ao remover agendamentos do cliente: ${appointmentsError.message}`
        );
      }

      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) {
        throw new Error(`Erro ao deletar cliente: ${error.message}`);
      }

      return true;
    },

    async createAppointment(businessId, form) {
      const now = new Date();
      const [hours, minutes] = String(form.time || "09:00").split(":");
      now.setHours(Number(hours), Number(minutes), 0, 0);

      const payload = {
        business_id: businessId,
        client_id: form.clientId,
        scheduled_start: now.toISOString(),
        status: form.status || "Pendente",
        price: Number(form.value || 0),
        notes: form.service || null,
      };

      const { data, error } = await supabase
        .from("appointments")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw new Error(`Erro ao criar agendamento: ${error.message}`);
      }

      return data;
    },

    async createSale(businessId, form) {
      const payload = {
        business_id: businessId,
        client_id: form.clientId || null,
        payment_method: form.method,
        total_amount: Number(form.amount || 0),
        notes: form.item || null,
      };

      const { data, error } = await supabase
        .from("sales")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw new Error(`Erro ao criar venda: ${error.message}`);
      }

      return data;
    },

    async updateProfile(form) {
      const user = await getCurrentUser();

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: form.name,
        phone: form.phone || null,
      });

      if (profileError) {
        throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);
      }

      const { data: businesses, error: businessReadError } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_user_id", user.id)
        .limit(1);

      if (businessReadError) {
        throw new Error(`Erro ao buscar negócio: ${businessReadError.message}`);
      }

      const businessId = businesses?.[0]?.id;

      if (!businessId) {
        throw new Error("Nenhum negócio encontrado para atualizar.");
      }

      const { error: businessUpdateError } = await supabase
        .from("businesses")
        .update({ name: form.businessName })
        .eq("id", businessId);

      if (businessUpdateError) {
        throw new Error(
          `Erro ao atualizar negócio: ${businessUpdateError.message}`
        );
      }

      return true;
    },
  };
}