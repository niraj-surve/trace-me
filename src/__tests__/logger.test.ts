import { logger, updateLoggerTraceLevels } from "../logger";
import { runWithContext, setTraceId } from "../context";

describe("logger", () => {
  it("should log with trace ID when level is enabled", () => {
    updateLoggerTraceLevels(["info"]);

    const logs: string[] = [];
    const transport = logger.transports[0];
    const origLog = transport.log;

    transport.log = (info, next) => {
      logs.push(info[Symbol.for("message")]);
      next?.();
    };

    runWithContext(() => {
      setTraceId("test-trace-id");
      logger.info("Hello trace");
    });

    transport.log = origLog; // Restore

    const found = logs.some((line) => line.includes("[test-trace-id]"));
    expect(found).toBe(true);
  });

  it("should not log trace ID if level is not enabled", () => {
    updateLoggerTraceLevels(["error"]);

    const logs: string[] = [];
    const transport = logger.transports[0];
    const origLog = transport.log;

    transport.log = (info, next) => {
      logs.push(info[Symbol.for("message")]);
      next?.();
    };

    runWithContext(() => {
      setTraceId("test-trace-id");
      logger.info("No trace here");
    });

    transport.log = origLog;

    const found = logs.some((line) => line.includes("[test-trace-id]"));
    expect(found).toBe(false);
  });
});
