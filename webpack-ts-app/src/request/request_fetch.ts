import { formatFetchData } from "./format";
import { reactive, toRefs } from "vue";
import type {
  IRequestResult,
  IRequestErrorMessage,
  IRequestOption,
  IResponse,
} from "./request.type";

export function request_fetch(
  url: string,
  init: RequestInit,
  option?: IRequestOption,
) {
  const result = reactive<IRequestResult>({
    success: false,
    loading: true,
    response: {},
    error: null,
  });

  const timeout = option?.timeout ?? 2500;
  const res = formatFetchData(url, init);

  fetch(res.url, res.init)
    .then((response) => {
      //只要收到response
      //404 500

      if (response.ok) {
        //200-299 成功拿到数据
        return response.json();
        //response.blob()
        //response.text()
      } else {
        //404 500 错误的情况
        handleError({
          code: response.status.toString(), //404 500
          name: response.statusText,
          message: "服务奔溃了，请稍后重试",
        });
        return { code: "-1" };
      }
    })
    .then((data) => {
      //if(data?code=="")
      if (data) {
        //数据是有内容的，不是空数据
        handleSuccess(data);
      } else if (data?.code != "-1" || data.success == "0") {
        handleError({
          code: "600",
          name: "Empty data",
          message: "数据是空的",
        });
      }
    })
    .catch((err) => {
      //断网 弱网
      handleError({
        code: "700",
        name: "Timeout",
        message: "网络异常，请核对网络后重试",
      });
    });

  const td = setTimeout(() => {
    res.control.abort();
  }, timeout);

  //原则： 重复代码封装一下
  function handleSuccess(data: any) {
    result.success = true;
    result.loading = false;
    result.response = data;
    clearTimeout(td);
    //上报 成功
  }

  function handleError(errorParmas: IRequestErrorMessage) {
    result.success = false;
    result.loading = false;
    result.error = errorParmas;
    clearTimeout(td);
    //上报 失败
  }

  return toRefs(result);
}

export function request_promiss(
  url: string,
  init: RequestInit,
  option?: IRequestOption,
): Promise<IResponse> {
  const timeout = option?.timeout ?? 2500;
  const res = formatFetchData(url, init);

  const td = setTimeout(() => {
    res.control.abort();
  }, timeout);

  return fetch(res.url, res.init)
    .then((response) => {
      //只要收到response
      //404 500

      if (response.ok) {
        //200-299 成功拿到数据
        return response.json();
        //response.blob()
        //response.text()
      } else {
        //404 500 错误的情况
        return {
          success: false,
          code: response.status.toString(), //404 500
          name: response.statusText,
          message: "服务奔溃了，请稍后重试",
        };
      }
    })
    .then((data) => {
      //if(data?code=="")
      if (data) {
        //数据是有内容的，不是空数据
        return {
          data,
          success: true,
        };
      } else if (
        data?.code != "-1" ||
        data.success == "0" ||
        data.success == false
      ) {
        return {
          success: false,
          code: "600",
          name: "Empty data",
          message: "数据是空的",
        };
      } else {
        return {
          success: false,
          code: "700",
        };
      }
    });
}
