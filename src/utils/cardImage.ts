import type { RequestEvent, RequestEventBase, RequestEventLoader } from "@builder.io/qwik-city";
import { createClientServer }                                 from "~/lib/supabase-qwik";

export function getCardImageUrl (imageName: string, request: RequestEvent | RequestEventLoader | RequestEventBase): string {
  const supabase = createClientServer(request);

  const { data } = supabase.storage.from('CardImages/cards').getPublicUrl(imageName);

  return data.publicUrl;
}
