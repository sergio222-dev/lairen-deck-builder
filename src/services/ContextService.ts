import type { RequestEvent } from "@builder.io/qwik-city";
import type { Service }                          from "~/services/interfaces/Service";

export class ContextService implements Service {
  static instance: ContextService | undefined;
  static ctx: RequestEvent | undefined;

  static getInstance() {
    if (!ContextService.instance) {
      ContextService.instance = new ContextService();
    }
    return ContextService.instance;
  }

  setContext(ctx: RequestEvent) {
    ContextService.ctx = ctx;
  }

  getContext() {
    return ContextService.ctx;
  }
}
