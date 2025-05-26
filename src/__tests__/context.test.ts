import { runWithContext, setTraceId, getTraceId } from "../context";

describe("context", () => {
  it("should store and retrieve trace ID within context", (done) => {
    runWithContext(() => {
      setTraceId("test-trace");
      expect(getTraceId()).toBe("test-trace");
      done();
    });
  });

  it("should return undefined outside context", () => {
    expect(getTraceId()).toBeUndefined();
  });
});
