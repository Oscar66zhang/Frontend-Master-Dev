import type { AxiosRequestConfig } from "axios";
import { isHttpProtocol, addOrUpdateParams } from "../utils/url";

let BASE_URL = "http://m.jj.com/api";

if (process.env.NODE_ENV === "development") {
  BASE_URL = "";
}

const TIMEOUT = 2500;
const PARAMS = {
  client: "h5",
};

/**
 * 格式化 axios 请求配置，统一注入公共参数和默认值
 * @param url 请求路径
 * @param config 可选的 axios 配置，会与全局默认配置合并
 * @returns 合并后的完整 AxiosRequestConfig
 */
export function formatData(url: string, config?: AxiosRequestConfig<any>) {
  config = config || {};

  const _config: AxiosRequestConfig = {
    baseURL: config.baseURL ?? BASE_URL, // 优先用传入的，否则用默认域名
    timeout: config.timeout ?? TIMEOUT, // 优先用传入的，否则用 2500ms 超时
    url, // 请求路径
    params: Object.assign(PARAMS, config.params || {}), // 合并公共参数（如 client: "h5"）到 params
    method: config.method ?? "get", // 没传 method 默认为 "get"
    withCredentials: true, // 跨域请求是否携带 cookie
  };

  return _config;
}

/**
 * 格式化原生 fetch 请求配置，注入默认值并支持请求中断（AbortController）
 * @param url 请求路径，若无协议则自动拼接 BASE_URL
 * @param init fetch 可选配置对象
 * @returns 包含完整 url、init 配置和 control（用于取消请求）的对象
 */
export function formatFetchData(url: string, init: RequestInit) {
   //url 处理 /api?index,action
  if (!isHttpProtocol(url)) {
    url = BASE_URL + url;
  }
  //处理request
  init = init || {};
  init.mode = init.mode || "cors";
  init.method = init.method || "GET"; //大写
  init.credentials = init.credentials || "include"; //跨域请求携带cookie

  //请求中断
  const control = new AbortController();
  const signal = control.signal;

  init.signal = signal;
  return { url, init, control };
}
