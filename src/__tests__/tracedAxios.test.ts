import { setAxiosInstance, getAxiosInstance } from "../tracedAxios";
import { runWithContext, setTraceId } from "../context";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";

describe("tracedAxios", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Reset to default instance and reapply mock
    setAxiosInstance(axios.create());
    mock = new MockAdapter(getAxiosInstance());
  });

  function extractTraceIdHeader(
    config: AxiosRequestConfig
  ): string | undefined {
    const headers = config.headers;
    if (headers instanceof AxiosHeaders) {
      const raw = headers.get("x-trace-id");
      return raw != null ? String(raw) : undefined;
    } else if (headers && typeof headers === "object") {
      return (headers as Record<string, string>)["x-trace-id"];
    }
    return undefined;
  }

  it("should inject trace ID header in requests", async () => {
    await new Promise<void>((resolve) => {
      runWithContext(async () => {
        setTraceId("axios-trace");
        mock.onGet("/test").reply((config) => {
          const traceHeader = extractTraceIdHeader(config);
          expect(traceHeader).toBe("axios-trace");
          resolve(); // resolve here to complete the test after assertion
          return [200, {}];
        });

        await getAxiosInstance().get("/test");
      });
    });
  });

  it("should use custom instance and inject trace ID", async () => {
    const customInstance = axios.create();
    const customMock = new MockAdapter(customInstance);
    setAxiosInstance(customInstance);

    await new Promise<void>((resolve) => {
      runWithContext(async () => {
        setTraceId("custom-trace");
        customMock.onGet("/custom").reply((config) => {
          const traceHeader = extractTraceIdHeader(config);
          expect(traceHeader).toBe("custom-trace");
          resolve();
          return [200, {}];
        });

        await getAxiosInstance().get("/custom");
      });
    });
  });
  
  it("should inject fallback trace ID if none in context", async () => {
    await new Promise<void>((resolve) => {
      mock.onGet("/no-trace").reply((config) => {
        const traceHeader = extractTraceIdHeader(config);
        expect(traceHeader).toBe("no-trace-id");
        resolve();
        return [200, {}];
      });

      // No trace ID set here
      runWithContext(async () => {
        await getAxiosInstance().get("/no-trace");
      });
    });
  });
});
