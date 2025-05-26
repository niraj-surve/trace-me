import * as traceMe from "../index";

describe("index exports", () => {
  it("should export expected symbols", () => {
    expect(traceMe.logger).toBeDefined();
    expect(traceMe.tracingMiddleware).toBeInstanceOf(Function);
    expect(traceMe.setAxiosInstance).toBeInstanceOf(Function);
    expect(traceMe.getAxiosInstance).toBeInstanceOf(Function);
    expect(traceMe.setTraceIdHeader).toBeInstanceOf(Function);
  });

  it("should invoke exported functions without error", () => {
    // middleware
    const mw = traceMe.tracingMiddleware();
    expect(mw).toBeInstanceOf(Function);

    // config
    traceMe.setTraceIdHeader("x-custom-trace");

    // axios instance
    const instance = traceMe.getAxiosInstance();
    traceMe.setAxiosInstance(instance);
  });
});
