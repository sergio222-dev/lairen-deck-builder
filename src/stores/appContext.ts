import { $, createContextId, useStore } from "@builder.io/qwik";
import type { AppContextState }         from "~/stores/models/AppModel";

const initialState = {
  isLoading: false
}

export const useAppStore = (isMaintenance: boolean) => {
  return useStore<AppContextState>({
    ...initialState,
    dialogYesNo: undefined,
    setLoading: $(async function (this, isLoading) {
      this.isLoading = isLoading;
    }),
    isMaintenance: isMaintenance,
  })
}

export const AppContext = createContextId<AppContextState>("app-context");
