type AsyncResult = any | null;
type AsyncError = Error | null;
export type AsyncReturn<R, E> = [R, null] | [R, E];

type AsyncFunctionReturn<R> = Promise<R>;

export async function on<R = AsyncResult, E = AsyncError>(fn: AsyncFunctionReturn<R>): Promise<AsyncReturn<R, E>> {
  try {
    const result = await fn;
    return [result, null];
  } catch (error) {
    return [false as R, error as E];
  }
}

