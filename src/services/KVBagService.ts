import type { RequestEventLoader } from "@builder.io/qwik-city";
import { Container }               from "~/services/Container";
import type { ContextService }     from "~/services/ContextService";
import type { BagService }         from "~/services/interfaces/BagService";

export class KVBagService implements BagService {
  async setValue(key: string, value: string): Promise<void> {
    const container = Container.getInstance();
    const ctx       = container.getService<ContextService>('context-service')
      .getContext() as unknown as RequestEventLoader;

    await ctx.platform.env?.[ctx.platform.env['KV_NS']]?.put(key, value);
  }

  async getValue(key: string): Promise<string> {
    const container = Container.getInstance();
    const ctx       = container.getService<ContextService>('context-service')
      .getContext() as unknown as RequestEventLoader;

    console.log(ctx.platform.env);

    return await ctx.platform.env?.[ctx.platform.env['KV_NS']]?.get(key);
  }
}
