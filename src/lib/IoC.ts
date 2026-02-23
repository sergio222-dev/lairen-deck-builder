import { TOKEN_MAP } from '~/app/shared/binds/binds';
import { Logger }    from '~/lib/logger';

type InjectableClass<T = any> = {
  new(...args: any[]): T;          // constructor de instancia
  inject: Readonly<Array<keyof TOKEN_MAP>>;        // propiedad estática requerida
};

type InjectCalleable = (...args: any[]) => any;

function isClass(value: unknown): value is new (...args: any[]) => any {
  return (
    typeof value === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(value))
  );
}

function isInjectableClass(c: InjectableClass | unknown): c is InjectableClass {
  return (c as InjectableClass).inject !== undefined;
}

function isCalleable(c: InjectCalleable | unknown): c is InjectCalleable {
  return typeof c === 'function';
}

export class IoC {
  private static _instance: IoC;

  private _providers: Map<string, any>       = new Map();
  private _providers_value: Map<string, any> = new Map();

  private _instances: Map<string, any> = new Map();

  static get instance() {
    if (!IoC._instance) {
      IoC._instance = new IoC();
    }

    return IoC._instance;
  }

  provide<K extends keyof TOKEN_MAP>(key: K, provider: new (...args: any[]) => TOKEN_MAP[K]) {
    this._providers.set(key, provider);

    return this;
  }

  provideFactory<K extends keyof TOKEN_MAP>(key: K, provider: new (...args: any[]) => TOKEN_MAP[K]) {
    this._providers.set(key, provider);

    return this;
  }

  provideValue<K extends keyof TOKEN_MAP>(key: K, provider: TOKEN_MAP[K]) {
    this._providers_value.set(key, provider);

    return this;
  }

  resolve<K extends keyof TOKEN_MAP>(key: K): TOKEN_MAP[K] {
    // check if is a value first
    const constructor = this._providers.get(key);
    const value       = this._providers_value.get(key);
    if (!constructor && !value) {
      throw new Error(`Cannot resolve provider '${String(key)}'`);
    }

    // check if the instance exists
    if (this._instances.has(key)) return this._instances.get(key);

    // get injectables
    return this.resolveInjectable(constructor ?? value);
  }

  private resolveInjectable<T>(t: any): T {
    // get Injectables
    if (isClass(t)) {

      // get key from the class
      let key;
      for (const [k, v] of this._providers.entries()) {
        if (v === t) {
          key = k;
          break;
        }
      }

      if (key === undefined) {
        throw new Error(`Cannot resolve provider '${String(key)}'`);
      }


      if (!isInjectableClass(t)) {
        const instance = new t();

        this._instances.set(key, instance);

        Logger.debug(`Resolved provider '${key}': ${instance.constructor.name}`);
        return instance;
      }

      const injectables = t.inject ?? [];
      const deps        = injectables.map((dep: keyof TOKEN_MAP) => {
        return this.resolve(dep);
      });

      const instance = new t(...deps);

      this._instances.set(key, instance);

      Logger.debug(`Resolved provider '${key}': ${instance.constructor.name}`);
      return instance;
    }

    // if (isCalleable(t)) {
    //   Logger.debug(  `ESTO ES UNA FUNCION?`)
    //   Logger.debug(`Resolved function for ${t.name}`);
    //   return t();
    // }

    return t;
  }

}
