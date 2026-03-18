import React from "react";
import { DATA_SOURCE } from "../data/constants";
import { createInitialDb } from "../data/initialDb";
import { createRepository } from "../repositories/createRepository";

export function usePulsoDatabase() {
  const repository = React.useMemo(() => createRepository(DATA_SOURCE), []);
  const [db, setDb] = React.useState(createInitialDb());
  const [isReady, setIsReady] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState("Inicializando banco...");

  React.useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const loaded = await repository.load();

        if (!isMounted) return;

        setDb(loaded);
        setSyncMessage(`Fonte de dados: ${repository.name}`);
      } catch (error) {
        if (!isMounted) return;

        setDb(createInitialDb());
        setSyncMessage(
          error instanceof Error ? error.message : "Falha ao carregar dados."
        );
      } finally {
        if (isMounted) setIsReady(true);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [repository]);

  async function persist(nextDb) {
    setDb(nextDb);

    try {
      await repository.save(nextDb);
      setSyncMessage(`Sincronizado com ${repository.name}`);
    } catch (error) {
      setSyncMessage(
        error instanceof Error ? error.message : "Falha ao salvar alterações."
      );
    }
  }

  async function resetDemo() {
    try {
      const fresh = await repository.reset();
      setDb(fresh);
      setSyncMessage(`Base reiniciada em ${repository.name}`);
    } catch (error) {
      setSyncMessage(
        error instanceof Error ? error.message : "Falha ao reiniciar base."
      );
    }
  }

  return {
    db,
    isReady,
    syncMessage,
    repository,
    persist,
    resetDemo,
  };
}