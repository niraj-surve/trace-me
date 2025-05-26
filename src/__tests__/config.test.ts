import { DEFAULT_TRACE_ID_HEADER, getTraceIdHeader, setTraceIdHeader } from "../config";

describe("config", () => {
  afterEach(() => {
    setTraceIdHeader(DEFAULT_TRACE_ID_HEADER);
  });

  it("should return default header initially", () => {
    expect(getTraceIdHeader()).toBe(DEFAULT_TRACE_ID_HEADER);
  });

  it("should update the trace header", () => {
    setTraceIdHeader("X-Custom-Trace");
    expect(getTraceIdHeader()).toBe("x-custom-trace");
  });

  it("should throw error on invalid header", () => {
    expect(() => setTraceIdHeader("")).toThrow();
    expect(() => setTraceIdHeader(null as any)).toThrow();
  });
});
