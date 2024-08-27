import { ContextService } from "~/services/ContextService";
import type { Service }   from "~/services/interfaces/Service";
import { KVBagService }   from "~/services/KVBagService";

type ServiceToken = "context-service" | "bag-service";

export class Container {
  private services: Map<string, Service> = new Map();
  static instance: Container | undefined;
  isBuilt: boolean                       = false;

  static getInstance() {
    if (!Container.instance) {
      Container.instance = new Container();
    }

    if (!Container.instance.isBuilt) {
      Container.instance.build();
    }

    return Container.instance;
  }

  build() {
    // register services
    this.register(new KVBagService(), 'bag-service');
    this.register(new ContextService(), 'context-service');

    this.isBuilt = true;
  }

  register(service: Service, token: ServiceToken) {
    this.services.set(token, service);
  }

  getService<T extends Service>(token: ServiceToken): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service ${token} not found`);
    }
    return service as T;
  }
}
