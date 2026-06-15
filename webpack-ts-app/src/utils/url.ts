// 检测 URL 是否以 http:// 或 https:// 开头
const StartWithHTTPReg = new RegExp(/^http(s?):\/\/.+/);

/**
 * 判断网址是否带有 http 或 https 协议
 * @param url 需要检测的 URL 字符串
 * @returns true 表示有协议（绝对路径），false 表示没有（相对路径）
 */
export function isHttpProtocol(url: string): boolean {
  return StartWithHTTPReg.test(url);
}

// 向 url 追加 query 参数（如 ?foo=bar），参数已存在则覆盖其值；url 非法时原样返回
export function addOrUpdateParams(
  url: string,
  params: { [key: string]: string },
) {
  try {
    // 利用浏览器 URL 对象解析和操作 query 参数
    const uri = new URL(url);
    Object.keys(params).forEach((key) => {
      // ?? "" 防止 params[key] 为 undefined 时出错
      uri.searchParams.set(key, params[key] ?? "");
    });

    return uri.href;
  } catch (err) {
    // URL 格式非法时，直接返回原始字符串
    return url;
  }
}