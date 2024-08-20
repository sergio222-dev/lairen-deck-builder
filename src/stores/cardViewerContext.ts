import { $, createContextId, useStore } from "@builder.io/qwik";
import type { CardViewerState }         from "~/stores/models/CardViewerModel";

export const useCardViewerStore = () => {
  return useStore<CardViewerState>({
    isOpen:  false,
    card:    undefined,
    setCard: $(async function (this, card) {
      this.card = card;
    }),
  })
}

export const CardViewerContext = createContextId<CardViewerState>("card-viewer-context");
