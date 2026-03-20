export const DATA_SOURCE = "supabase";
export const DB_KEY = "pulso_db_v3";

export const onboardingSteps = [
  {
    eyebrow: "PULSO",
    title: "Sua operação em um só lugar",
    description:
      "Cadastre clientes, acompanhe compromissos e registre vendas com uma experiência simples e direta.",
  },
  {
    eyebrow: "ROTINA",
    title: "Mais clareza no dia a dia",
    description:
      "Visualize agenda, relacionamento e faturamento sem depender de anotações soltas ou conversas perdidas.",
  },
  {
    eyebrow: "COMEÇO",
    title: "Estruture seu negócio com ritmo",
    description:
      "Entre na PULSO e construa uma base organizada para crescer com consistência.",
  },
];

export const quickActions = [
  { label: "Cadastrar", icon: "+", action: "new-client" },
  { label: "Registrar", icon: "R$", action: "new-sale" },
  { label: "Agendar", icon: "⏰", action: "new-appointment" },
];

export const tagStyles = {
  Recorrente: "bg-[#2ECF8F]/20 text-[#0F3D3E]",
  VIP: "bg-[#0F3D3E] text-white",
  Nova: "bg-[#F4EFE8] text-[#0F3D3E]",
  Inativa: "bg-[#1E1E1E]/10 text-[#1E1E1E]/70",
};

export const appointmentStatusStyles = {
  Confirmado: "bg-[#2ECF8F]/20 text-[#0F3D3E]",
  "Em breve": "bg-[#F4EFE8] text-[#0F3D3E]",
  Pendente: "bg-[#1E1E1E]/10 text-[#1E1E1E]/70",
  Concluído: "bg-[#2ECF8F]/20 text-[#0F3D3E]",
  Cancelado: "bg-[#1E1E1E]/10 text-[#1E1E1E]/70",
};