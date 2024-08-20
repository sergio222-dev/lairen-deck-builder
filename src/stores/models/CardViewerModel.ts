import type { QRL }           from "@builder.io/qwik";
import type { Card }               from "~/models/Card";
import type { CardView } from "~/stores/models/CardView";

export interface CardViewerState {
  card?: CardView;
  isOpen: boolean;
  setCard: QRL<(this: CardViewerState, cardId: Card) => void>;
}
