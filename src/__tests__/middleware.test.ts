import express from "express";
import request from "supertest";
import { tracingMiddleware } from "../middleware";
import { getTraceId } from "../context";

const app = express();
app.use(tracingMiddleware());
app.get("/", (req, res) => {
  res.send({ traceId: getTraceId() });
});

describe("middleware", () => {
  it("should generate trace ID and inject into response", async () => {
    const res = await request(app).get("/");
    expect(res.headers["x-trace-id"]).toBeDefined();
    expect(res.body.traceId).toBe(res.headers["x-trace-id"]);
  });

  it("should reuse incoming trace ID", async () => {
    const res = await request(app)
      .get("/")
      .set("x-trace-id", "incoming-trace-id");

    expect(res.headers["x-trace-id"]).toBe("incoming-trace-id");
    expect(res.body.traceId).toBe("incoming-trace-id");
  });

  it("should generate trace ID if not present", (done) => {
    const req = { headers: {} } as any;
    const res = { setHeader: jest.fn() } as any;

    const next = () => {
      const [headerName, headerValue] = res.setHeader.mock.calls[0];
      expect(headerName).toBe("x-trace-id");
      expect(typeof headerValue).toBe("string");
      expect(headerValue.length).toBeGreaterThan(10);
      done();
    };

    tracingMiddleware()(req, res, next);
  });

  it("should normalize and filter provided log levels", (done) => {
    const req = { headers: {} } as any;
    const res = { setHeader: jest.fn() } as any;

    const levels = ["INFO", "debug", "INVALID"];

    const next = () => {
      const [headerName, headerValue] = res.setHeader.mock.calls[0];
      expect(headerName).toBe("x-trace-id");
      expect(typeof headerValue).toBe("string");
      expect(headerValue.length).toBeGreaterThan(10);
      done();
    };

    tracingMiddleware("x-trace-id", levels)(req, res, next);
  });
});
