React.useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      setCurrentScreen("Dashboard");
    } else {
      setCurrentScreen("Onboarding");
    }
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setCurrentScreen("Dashboard");
      setAuthError("");
      setAuthSuccess("");
      return;
    }

    if (event === "SIGNED_OUT") {
      setCurrentScreen("Login");
    }
  });

  return () => subscription.unsubscribe();
}, []);