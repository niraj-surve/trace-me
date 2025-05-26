export const DEFAULT_TRACE_ID_HEADER = "x-trace-id";

let traceIdHeader = DEFAULT_TRACE_ID_HEADER;

export function setTraceIdHeader(name: string) {
  if (!name || typeof name !== "string") {
    throw new Error("[trace-me] Invalid trace ID header name.");
  }
  traceIdHeader = name.toLowerCase();
}

export function getTraceIdHeader() {
  return traceIdHeader;
}
