import { createLogger, format, transports, Logger } from "winston";
import { getTraceId } from "./context";

const { combine, timestamp, printf, colorize } = format;

let traceLevels: string[] | null = null;

const createLogFormat = () => {
  return printf(({ timestamp, level, message }) => {
    const cleanLevel = level.replace(/\x1b\[\d+m/g, "").toLowerCase();
    const shouldShowTrace =
      traceLevels === null || (traceLevels && traceLevels.includes(cleanLevel));
    const traceId = shouldShowTrace ? getTraceId() : undefined;

    return `[${timestamp}] [${level}]${
      traceId ? ` [${traceId}]` : ""
    } ${message}`;
  });
};

const logger: Logger = createLogger({
  level: "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    createLogFormat()
  ),
  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

export function updateLoggerTraceLevels(levels: string[] | null) {
  traceLevels = levels ? levels.map((l) => l.toLowerCase().trim()) : null;

  logger.configure({
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      createLogFormat()
    ),
    transports: logger.transports,
    exitOnError: false,
  });
}

export { logger };
