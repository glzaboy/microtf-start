import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
} from 'axios';
import { isSSR } from './isSSR';
import { getLocaleTable } from '@/components/utils/useLocale';
// import { Message } from '@arco-design/web-react';
import message from '@/components/base/Message';
import requestLocale from '@/locale/request';
let requestInstance: AxiosInstance;
let config: AxiosRequestConfig;
const getConfig = (): AxiosRequestConfig => {
  if (config) return config;
  config = {};
  return config;
};

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  const config = getConfig();
  requestInstance = axios.create(config);

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  // requestInstance.interceptors.response.use((response) => {
  //   const { data } = response;
  //   // if(data?.success === false && config?.errorConfig?.errorThrower){
  //   //     // config.errorConfig.errorThrower(data);
  //   // }
  //   return response;
  // });
  return requestInstance;
};
// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  lang?: string;
  /**
   * SSR模块下附带cookie
   */
  withCookie?: Partial<{
    [key: string]: string;
  }>;
}

interface IRequest {
  //eslint-disable-next-line
  <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
  //eslint-disable-next-line
  <T = any>(url: string): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
}

const request: IRequest = (
  url: string,
  opts: IRequestOptions = { method: 'GET' }
) => {
  const t = getLocaleTable(requestLocale, opts.lang || 'zh-CN');
  const headers = opts.headers || {};
  if (isSSR) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (process.env.PORT !== undefined) {
        url = 'http://localhost:' + process.env.PORT + '/' + url;
      } else {
        url = 'http://localhost/' + url;
      }
    }
    if (opts.withCookie) {
      let cookie = '';
      for (const x in opts.withCookie) {
        cookie += x + '=' + encodeURIComponent(opts.withCookie[x] || '') + ';';
      }
      headers['cookie'] = cookie;
    }
    delete opts.headers;
    delete opts.withCookie;
  }

  const requestInstance = getRequestInstance();
  return new Promise((resolve, reject) => {
    requestInstance
      .request({ ...opts, headers: headers, url })
      .then((res) => {
        const data = res.data;
        if (data.code != 0) {
          reject(data.msg);
        }
        resolve(res.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          reject(
            t['request.server.unavailable'] +
              error.response.status +
              ' ' +
              error.response.statusText
          );
        } else if (error.request) {
          reject(t['request.server.network.error'] + error.request);
        } else {
          reject(t['request.server.retry'] + error);
        }
      });
  });
};
/**
 * UI请求，异常消息信息提示
 * @param url url
 * @param opts 参数
 * @returns
 */
const requestMsg: IRequest = (
  url: string,
  opts: IRequestOptions = { method: 'GET' }
) => {
  const t = getLocaleTable(requestLocale, opts.lang || 'zh-CN');
  const requestInstance = getRequestInstance();

  return new Promise((resolve, reject) => {
    if (isSSR) {
      reject(t['request.browsers.only']);
    }
    requestInstance
      .request({ ...opts, url })
      .then((res) => {
        const data = res.data;
        if (data.code != 0) {
          data.msg &&
            message.error({
              message: data.msg,
            });
          reject(data.msg);
        } else {
          data.msg &&
            message.info({
              message: data.msg,
            });
        }
        resolve(res.data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          message.error({
            message:
              t['request.server.unavailable'] + ' ' + error.response.statusText,
          });

          reject(
            t['request.server.unavailable'] +
              error.response.status +
              ' ' +
              error.response.statusText
          );
        } else if (error.request) {
          message.error({
            message: t['request.server.network.error'] + ' ' + error.request,
          });
          reject(t['request.server.network.error'] + error.request);
        } else {
          message.error({
            message: t['request.server.retry'] + ' ' + error,
          });
          reject(t['request.server.retry'] + error);
        }
      });
  });
};

export { request, requestMsg, getRequestInstance };

export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  IRequestOptions as RequestOptions,
  IRequest as Request,
};
