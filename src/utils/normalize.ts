export interface Entity {
  id: number;
}

export interface NormalizedModel<T extends Entity> {
  [id: string]: T;
}


export function normalizeArray<T extends Entity>(value: Array<T>): NormalizedModel<T> {
  return value.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as NormalizedModel<T>);
}

export function normalizeData<T extends { id: number; }>(value: Array<T>): Record<string, T> {
  return value.reduce((acc, item) => {
    acc[item.id.toString()] = item;
    return acc;
  }, {} as Record<string, T>);
}

export function normalize<
  K extends PropertyKey,
  T extends Record<K, string | number>
>(
  key: K,
  values: T[]
): Record<string | number, T> {
  return values.reduce((acc, item) => {
    const k = item[key];
    acc[k] = item;
    return acc;
  }, {} as Record<string | number, T>);
}

export function denormalizeEntity<T extends Entity>(value: NormalizedModel<T>): Array<T> {
  const array: Array<T> = [];

  for (const entity of Object.values(value)) {
    if (!entity) continue;
    array.push(entity);
  }

  return array;
}
