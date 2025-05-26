import axios, { AxiosInstance } from "axios";
import { getTraceId } from "./context";
import { getTraceIdHeader } from "./config";

let instance: AxiosInstance = axios.create();

function injectTraceId(inst: AxiosInstance) {
  inst.interceptors.request.use((config) => {
    const traceId = getTraceId();
    if (config.headers) {
      config.headers[getTraceIdHeader()] = traceId || "no-trace-id";
    }
    return config;
  });
}

injectTraceId(instance);

export function setAxiosInstance(newInstance: AxiosInstance) {
  instance = newInstance;
  injectTraceId(instance);
}

export function getAxiosInstance(): AxiosInstance {
  return instance;
}

export default instance;
