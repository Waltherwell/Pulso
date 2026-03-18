export function createInitialDb() {
  return {
    clients: [],
    appointments: [],
    sales: [],
    user: {
      name: "Usuário",
      businessName: "Meu Negócio",
      email: "",
    },
  };
}