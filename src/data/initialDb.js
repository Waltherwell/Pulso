export function createInitialDb() {
  return {
    clients: [],
    appointments: [],
    sales: [],
    user: {
      name: "Usuário",
      email: "",
      phone: "",
      businessName: "Meu Negócio",
    },
  };
}