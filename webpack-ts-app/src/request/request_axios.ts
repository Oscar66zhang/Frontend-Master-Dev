import axios, { type AxiosRequestConfig } from "axios";
import { formatData } from "./format";
import { reactive, toRefs } from "vue";
import type { IRequestResult, IRequestErrorMessage } from "./request.type";

/**
 * 基于 axios 的请求封装，自动处理 loading / success / error 状态
 * @param url 请求路径
 * @param config 可选的 axios 配置，会与全局默认配置合并
 * @returns 响应式对象（解构后仍保持响应性），包含 success、loading、response、error
 */
export function request_axios(url: string, config?: AxiosRequestConfig<any>) {
  // 1. 合并默认配置（baseURL、timeout、params、method 等）
  const _config = formatData(url, config);

  // 2. 创建响应式结果对象，跟踪请求各阶段状态
  const result = reactive<IRequestResult>({
    success: false,  // 请求是否成功
    loading: true,   // 是否 loading 中
    response: {},     // 成功的响应数据
    error: null,      // 失败时的错误信息
  });

  // 3. 发送请求
  axios(_config).then((response) => {
    // 后端返回的数据不一定可靠，这里做兜底判断
    if (response.data) {
      // 有数据 → 认为请求成功
      handleSuccess(response.data);
    } else {
      // 无数据 → 按失败处理
      handleError({
        code: "600",
        name: "empty data",
        message: "我们错啦，请稍后再来",
      });
    }
  });

  /** 成功处理：更新状态并写入响应数据 */
  function handleSuccess(data: any) {
    result.success = true;
    result.loading = false;
    result.response = data;
  }

  /** 失败处理：更新状态并写入错误信息（可扩展为上报日志） */
  function handleError(errorParmas: IRequestErrorMessage) {
    result.success = false;
    result.loading = false;
    result.error = errorParmas;
    // TODO: 这里可以加日志上报逻辑
  }

  // 4. 用 toRefs 包裹，这样调用方解构后仍是响应式的
  //    例如 const { success, loading } = request_axios(...)
  return toRefs(result);
}