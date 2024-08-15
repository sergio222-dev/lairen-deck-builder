import { $, createContextId, useStore } from "@builder.io/qwik";
import type { AppContextState }         from "~/stores/models/AppModel";

const initialState = {
  isLoading: false
}

export const useAppStore = () => {
  return useStore<AppContextState>({
    ...initialState,
    setLoading: $(async function (this, isLoading) {
      this.isLoading = isLoading;
    }),
  })
}

export const AppContext = createContextId<AppContextState>("app-context");
