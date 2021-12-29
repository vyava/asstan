import { Router } from "next/router";
import axios, { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import API_ERROR from "./Error";
import { APP_DESCRIPTION, APP_URL } from 'src/config';

type APIConfig = {
  url: string;
  isRefreshing?: boolean;
  retry?: boolean;
  timeout?: number | undefined;
}

export default class API {
  private instance: AxiosInstance;
  private isRefreshing: boolean;
  private retry: boolean;
  private url: string;
  private timeout: number | undefined;

  constructor({ url, isRefreshing = false, retry = false, timeout = 1000 }: APIConfig) {

    this.url = url;
    this.isRefreshing = isRefreshing;
    this.retry = retry;
    this.timeout = timeout;

    const axiosInstance = axios.create({
      baseURL: APP_URL,
      withCredentials : true,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      timeout: this.timeout
    });


    // axiosInstance.interceptors.request.use(this.beforeRequest)

    axiosInstance.interceptors.response.use(this.beforeResponse, this.errorHandler)

    this.instance = axiosInstance;
  };

  beforeRequest(axiosRequest: AxiosRequestConfig) {
    return axiosRequest;
  }

  beforeResponse(response: AxiosResponse) {
    return response?.data;
  };

  errorHandler(error: AxiosError | Error) {
    if ((error as AxiosError).isAxiosError) this.handleAxiosError(error as AxiosError)
    // return this.handleUnhandleError(error)
  };

  handleAxiosError(axiosError: AxiosError) {
    console.log("handleAxiosError", axiosError)
    // const { response } = axiosError;
    // const originalRequest = axiosError.config;

    // if (response?.status === 401 && axiosError && originalRequest && !this.retry) {
    //   if (this.isRefreshing) {

    //     try {
    //       // Get new TOKEN
    //       let newToken = "" /* getNewtoken(refreshToken) */

    //       this.instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    //       originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

    //       return this.instance(originalRequest);
    //     } catch (error) {
    //       // Refresh TOKEN failed
    //       console.error('Error refreshing the token, logging out', error);
    //       return response;
    //     }
    //   };

    // }

    // return axiosError.message;
  };

  handleUnhandleError(error: Error) {
    return error
  };

  async request(method: any, url: string, reqOptions: AxiosRequestConfig = {}, settings : any = {}) {
    const { headers, data, params, ...options } = reqOptions;
    const axiosOptions = {
      timeout: this.timeout,
      method,
      url: url,
      // headers: headers || this.getHeaders(),
      data: data || {},
      params: params || {},
      ...options
    };

    try {
      const response = await this.instance(axiosOptions).then(res => res).catch(err => {
        console.log("CATH ERROR : "+err)
      });

      const handleResponse = settings.onResponse || this.beforeResponse;

      return handleResponse(response);
    } catch (error) {
      // this.log('verbose', { traceId, error: error.toString(), data: error.response?.data, stack: error.stack, type: 'errorOccured' });
      // const onError = settings.onError || this.errorHandler;

      // onError(error);
      throw error;
    }
  };

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  get(url: string, params?: AxiosRequestConfig, options = {}) {
    return this.request('GET', url, {
      params,
      ...options
    })
  };

  post(url: string, data?: any, options = {}) {
    console.log("OPTIONS : "+JSON.stringify(options))
    console.log("DATA : "+JSON.stringify(data))
    return this.request('POST', url, {
      data,
      ...options
    });
  }

  patch(url: string, data?: any, options = {}) {
    return this.request('PATCH', url, {
      data,
      ...options
    });
  }

  put(url: string, data?: any, options = {}) {
    return this.request('PUT', url, {
      data,
      ...options
    });
  }

  delete(url: string, options = {}) {
    return this.request('DELETE', url, {
      ...options
    });
  }

}