import type { Service } from "~/services/interfaces/Service";

export interface BagService extends Service{
  getValue(key: string): Promise<string>;
  setValue(key: string, value: string): Promise<void>;
}
