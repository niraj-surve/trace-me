import { AsyncLocalStorage } from "async_hooks";

const storage = new AsyncLocalStorage<Map<string, string>>();

export function runWithContext(fn: () => void) {
  const store = new Map<string, string>();
  storage.run(store, fn);
}

export function setTraceId(traceId: string) {
  const store = storage.getStore();
  if (store) store.set("traceId", traceId);
}

export function getTraceId(): string | undefined {
  return storage.getStore()?.get("traceId");
}
