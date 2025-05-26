import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { runWithContext, setTraceId } from "./context";
import { getTraceIdHeader } from "./config";
import { updateLoggerTraceLevels } from "./logger";

/**
 * Middleware to set up tracing context and inject trace ID into logs.
 */
export function tracingMiddleware(
  headerName = "x-trace-id",
  levels?: string[]
) {
  const traceHeader = headerName.toLowerCase();
  const validLevels = ["error", "warn", "info", "verbose", "debug", "silly"];

  const normalizedLevels = levels
    ? levels.map((l) => l.toLowerCase()).filter((l) => validLevels.includes(l))
    : null;

  updateLoggerTraceLevels(normalizedLevels);

  return (req: Request, res: Response, next: NextFunction) => {
    const traceId = (req.headers[traceHeader] as string) || uuidv4();
    runWithContext(() => {
      setTraceId(traceId);
      res.setHeader(traceHeader, traceId);
      next();
    });
  };
}
