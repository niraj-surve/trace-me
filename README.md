<h1 align="center">Trace-Me: Comprehensive Request Tracing for Node.js Applications</h1>

<p align="center">
  <img src="./public/logo.png" width="200" alt="Trace-Me logo" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/trace-me">
    <img src="https://img.shields.io/npm/v/trace-me.svg" alt="npm version" />
  </a>
  <a href="https://github.com/niraj-surve/trace-me/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/niraj-surve/trace-me/ci.yml?branch=main" alt="build status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/trace-me.svg" alt="license" />
  </a>
  <a href="https://codecov.io/gh/niraj-surve/trace-me">
    <img src="https://codecov.io/gh/niraj-surve/trace-me/graph/badge.svg?token=361ZCTECWV" alt="codecov" />
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/node/v/trace-me" alt="node version" />
  </a>
</p>

<p align="center">
  <strong>Trace-Me</strong> is a lightweight Node.js package designed to simplify request tracing across your entire application stack. It provides seamless trace ID propagation through Express middleware, Axios requests, and Winston logging.
</p>

---

## ✨ Features

- 🌐 **End-to-end tracing** — Track requests across services
- 🛣️ **Express middleware** — Automatic trace ID generation and propagation
- 📡 **Axios integration** — Automatically inject trace IDs into outgoing requests
- 📝 **Winston logger integration** — Include trace IDs in your logs
- 🔍 **Async context management** — Uses AsyncLocalStorage for reliable context propagation
- ⚙️ **Customizable** — Configure trace ID header and logging levels

---

## 🚀 Use Cases

Trace-Me can be used in various parts of a Node.js ecosystem:

1. **Microservices architectures** — Propagate trace IDs across API calls between services.
2. **Express applications** — Log every HTTP request with a unique ID.
3. **APIs** — Add trace context to requests for better diagnostics.
4. **Background jobs & schedulers** — Set custom trace IDs for jobs.
5. **Third-party API calls** — Include trace IDs in outgoing HTTP requests.
6. **CI/CD environments** — Add traceable logs during deployment.
7. **Error monitoring systems** — Correlate alerts with traceable logs.

---

## 📦 Installation

```bash
npm install trace-me
# or
yarn add trace-me
# or
pnpm add trace-me
```

---

## 🧑‍💻 Quick Start

### Basic Express Setup

```ts
import express from "express";
import { tracingMiddleware, logger } from "trace-me";

const app = express();
app.use(tracingMiddleware());

app.get("/", (req, res) => {
  logger.info("Handling request");
  res.send("Hello World!");
});

app.listen(3000, () => {
  logger.info("Server started on port 3000");
});
```

---

## 🧠 Core Concepts

### 1. Tracing Middleware

```ts
import { tracingMiddleware } from "trace-me";

// Default usage
app.use(tracingMiddleware());

// Custom configuration
app.use(tracingMiddleware("x-custom-trace-id", ["error", "warn", "info"]));
```

- `headerName`: Custom trace ID header (default: `'x-trace-id'`)
- `levels`: Array of log levels that include trace IDs (`null` = all)

### 2. Logger Integration

```ts
import { logger, updateLoggerTraceLevels } from "trace-me";

logger.info("This will include a trace ID if available");

updateLoggerTraceLevels(["error", "info"]);
updateLoggerTraceLevels(null); // Reverts to all levels
```

### 3. Axios Integration

```ts
import { getAxiosInstance, setAxiosInstance } from "trace-me";
import axios from "axios";

// Default instance
await getAxiosInstance().get("https://api.example.com");

// Custom instance
const customAxios = axios.create({ baseURL: "https://api.example.com" });
setAxiosInstance(customAxios);
```

### 4. Manual Context Management

```ts
import { runWithContext, setTraceId, getTraceId } from "trace-me";

runWithContext(() => {
  setTraceId("manual-trace-id");
  console.log(getTraceId()); // → 'manual-trace-id'
});
```

---

## ⚙️ Advanced Usage

### Custom Header Name

```ts
import { setTraceIdHeader } from "trace-me";

setTraceIdHeader("x-custom-trace-id");
```

---

## 🔗 Real-World Microservices Example

### Service A (`service-a/index.ts`)

```ts
import express from "express";
import { tracingMiddleware, getAxiosInstance, logger } from "trace-me";

const app = express();
app.use(tracingMiddleware());

app.get("/call-service-b", async (req, res) => {
  const response = await getAxiosInstance().get("http://localhost:4000/data");
  logger.info("Received response from Service B");
  res.json({ from: "Service A", serviceB: response.data });
});

app.listen(3000, () => logger.info("Service A running on port 3000"));
```

### Service B (`service-b/index.ts`)

```ts
import express from "express";
import { tracingMiddleware, logger } from "trace-me";

const app = express();
app.use(tracingMiddleware());

app.get("/data", (req, res) => {
  logger.info("Handled request in Service B");
  res.json({
    message: "Hello from Service B",
    traceId: req.headers["x-trace-id"],
  });
});

app.listen(4000, () => logger.info("Service B running on port 4000"));
```

---

## ⏱ Scheduled Jobs / Background Tasks

```ts
import { runWithContext, setTraceId, logger } from "trace-me";

function runBackgroundJob() {
  runWithContext(() => {
    setTraceId(`job-${Date.now()}`);
    logger.info("Running background job");
    // Logic...
  });
}
```

---

## 🧪 Error Handling

```ts
import { logger } from "trace-me";

try {
  throw new Error("Something went wrong");
} catch (err) {
  logger.error("Caught error", { error: err });
}
```

---

## ⚙️ Configuration Summary

| Function                            | Description                             | Default                    |
| ----------------------------------- | --------------------------------------- | -------------------------- |
| `tracingMiddleware(header, levels)` | Apply trace ID middleware               | `'x-trace-id'`, all levels |
| `updateLoggerTraceLevels(levels)`   | Control which log levels show trace IDs | `null` (all levels)        |
| `setTraceIdHeader(name)`            | Globally set the trace header name      | `'x-trace-id'`             |
| `setAxiosInstance(instance)`        | Set a custom Axios instance             | Default Axios instance     |

---

## ✅ Best Practices

- Use consistent trace ID headers across services
- Set up the middleware early in your Express stack
- Include trace IDs in logs and error monitoring
- Use custom trace IDs for background tasks
- Instrument outgoing requests via Axios

---

## 🐛 Troubleshooting

**Trace IDs not showing in logs?**

- Make sure `tracingMiddleware` is applied before route handlers
- Ensure you call `runWithContext` if working outside Express

**Trace ID missing in Axios?**

- Always use `getAxiosInstance()` or call `setAxiosInstance(...)`

**Memory concerns?**

- `AsyncLocalStorage` is designed to avoid leaks. Avoid long-running contexts in `runWithContext`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear description

---

## 📄 License

MIT © [Niraj Surve](mailto:niraj.surve07@gmail.com)

---

Trace-Me helps bring full visibility to your Node.js applications with minimal setup. Whether you're building a monolith or microservices, this package adds traceability to every request, response, and log.
