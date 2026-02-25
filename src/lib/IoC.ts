import { TOKEN_MAP } from '~/app/shared/binds/binds';
import { Logger }    from '~/lib/logger';

type InjectableClass<T = any> = {
  new(...args: any[]): T;          // constructor de instancia
  inject: Readonly<Array<keyof TOKEN_MAP>>;        // propiedad estática requerida
};

type ProviderScope = 'Singleton' | 'request';

type ProviderMeta = {
  ctor: new (...args: any[]) => any;
  scope: ProviderScope;
};

function isInjectableClass(c: InjectableClass | unknown): c is InjectableClass {
  return (c as InjectableClass).inject !== undefined;
}

export class IoC {
  private static _instance: IoC;

  private _providers: Map<string, ProviderMeta>       = new Map();
  private _providers_value: Map<string, any>          = new Map();

  private _instances_singleton: Map<string, any> = new Map();
  private _instances_request: Map<string, any>   = new Map();

  static get instance() {
    if (!IoC._instance) {
      IoC._instance = new IoC();
    }

    return IoC._instance;
  }

  // Clears only request-scoped instances; call this at the beginning of each request
  resetRequestScope() {
    this._instances_request.clear();
    return this;
  }

  provide<K extends keyof TOKEN_MAP>(key: K, provider: new (...args: any[]) => TOKEN_MAP[K], scope: ProviderScope = 'request') {
    this._providers.set(key as unknown as string, { ctor: provider, scope });
    // Invalidate any existing instances for this key to respect potential scope change
    this._instances_singleton.delete(key as unknown as string);
    this._instances_request.delete(key as unknown as string);

    return this;
  }

  provideFactory<K extends keyof TOKEN_MAP>(key: K, provider: new (...args: any[]) => TOKEN_MAP[K], scope: ProviderScope = 'request') {
    // Treat factories the same as class providers, honoring scope
    this._providers.set(key as unknown as string, { ctor: provider, scope });
    this._instances_singleton.delete(key as unknown as string);
    this._instances_request.delete(key as unknown as string);

    return this;
  }

  provideValue<K extends keyof TOKEN_MAP>(key: K, provider: TOKEN_MAP[K]) {
    this._providers_value.set(key as unknown as string, provider);

    return this;
  }

  resolve<K extends keyof TOKEN_MAP>(key: K): TOKEN_MAP[K] {
    const stringKey = key as unknown as string;

    // values take precedence
    if (this._providers_value.has(stringKey)) {
      return this._providers_value.get(stringKey);
    }

    const meta = this._providers.get(stringKey);
    if (!meta) {
      throw new Error(`Cannot resolve provider '${String(key)}'`);
    }

    const cache = meta.scope === 'Singleton' ? this._instances_singleton : this._instances_request;
    if (cache.has(stringKey)) return cache.get(stringKey);

    // build dependencies (if any)
    const ctor: any = meta.ctor;
    let instance: any;

    if (!isInjectableClass(ctor)) {
      instance = new ctor();
    } else {
      const injectables = ctor.inject ?? [];
      const deps        = injectables.map((dep: keyof TOKEN_MAP) => this.resolve(dep));
      instance          = new ctor(...deps);
    }

    cache.set(stringKey, instance);

    Logger.debug(`Resolved provider '${stringKey}': ${instance.constructor?.name ?? 'unknown'}`);
    return instance;
  }
}
