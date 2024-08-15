import { QRL } from "@builder.io/qwik";

export interface AppContextState {
  isLoading: boolean;
  setLoading: QRL<(this: AppContextState, isLoading: boolean) => void>;
}
