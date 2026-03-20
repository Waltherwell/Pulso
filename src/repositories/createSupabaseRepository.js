import { supabase } from "../lib/supabase";
import { createInitialDb } from "../data/initialDb";

function mapClient(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || "",
    tag: row.tag || "Nova",
    lastVisit: row.last_visit_at ? "com histórico" : "ainda não atendido",
    spent: Number(row.total_spent || 0),
  };
}

function mapAppointment(row, clientsMap) {
  const date = row.scheduled_start ? new Date(row.scheduled_start) : null;

  return {
    id: row.id,
    clientId: row.client_id,
    name: clientsMap.get(String(row.client_id))?.name || "Cliente",
    service: row.notes || "Serviço",
    time: date
      ? date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "--:--",
    value: Number(row.price || 0),
    status: row.status || "Pendente",
  };
}

function mapSale(row, clientsMap) {
  const date = row.sale_date ? new Date(row.sale_date) : null;

  return {
    id: row.id,
    clientId: row.client_id,
    client: clientsMap.get(String(row.client_id))?.name || "Cliente",
    item: row.notes || "Venda",
    method: row.payment_method,
    amount: Number(row.total_amount || 0),
    time: date
      ? date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "--:--",
  };
}

async function getFirstBusiness() {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .limit(1);

  if (error) {
    throw new Error(`Erro ao buscar businesses: ${error.message}`);
  }

  return data?.[0] || null;
}

export function createSupabaseRepository() {
  return {
    name: "Supabase",
    mode: "supabase",

    async load() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(`Erro de sessão: ${sessionError.message}`);
      }

      if (!session) {
        return createInitialDb();
      }

      const business = await getFirstBusiness();

      if (!business) {
        return {
          ...createInitialDb(),
          user: {
            name: session.user.email || "Usuário",
            businessName: "Meu Negócio",
            email: session.user.email || "",
          },
        };
      }

      const [clientsRes, appointmentsRes, salesRes] = await Promise.all([
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
      ]);

      if (clientsRes.error) {
        throw new Error(`Erro ao buscar clients: ${clientsRes.error.message}`);
      }

      if (appointmentsRes.error) {
        throw new Error(
          `Erro ao buscar appointments: ${appointmentsRes.error.message}`
        );
      }

      if (salesRes.error) {
        throw new Error(`Erro ao buscar sales: ${salesRes.error.message}`);
      }

      const mappedClients = (clientsRes.data || []).map(mapClient);
      const clientsMap = new Map(
        mappedClients.map((client) => [String(client.id), client])
      );

      return {
        user: {
          name: session.user.email || "Usuário",
          businessName: business.name || "Meu Negócio",
          email: session.user.email || "",
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
  };
}