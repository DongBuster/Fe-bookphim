import type { IResponse } from '@shared/types/response';
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import {
  handleCommonHttpError,
  isBusinessError,
  rejectBusinessError,
  type BusinessError,
} from './axios-error-helper';
import { handleRefreshToken } from '../shared/utils/refreshToken';
import tokenManager from '../shared/utils/tokenManager';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silent?: boolean;
    skipNotification?: boolean;
  }
}

export interface IOriginRequest extends AxiosRequestConfig {
  _retry: boolean;
}

export type { BusinessError };
export { isBusinessError };

const handleRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const accessToken = tokenManager.getAccessToken();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.validateStatus = (status) => status >= 200 && status < 300;
  return config;
};

const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const handleResponse = (response: AxiosResponse<IResponse<unknown>>) => {
  const { data, config } = response;
  const isSilent = Boolean(
    (config as AxiosRequestConfig)?.silent ||
    (config as AxiosRequestConfig)?.skipNotification
  );

  if (data?.success === false) {
    return rejectBusinessError(data, !isSilent);
  }

  if (response.config.method === 'get') {
    if ((data as { metaData?: unknown })?.metaData) {
      return data;
    }
    return data.data;
  }

  return data;
};

const handleResponseError = async (error: AxiosError<IResponse<unknown>>) => {
  const originalRequest = error.config as IOriginRequest;

  if (error.response?.status === 401 && !originalRequest?._retry) {
    return handleRefreshToken(originalRequest);
  }

  const isSilent = Boolean(
    (error.config as AxiosRequestConfig)?.silent ||
    (error.config as AxiosRequestConfig)?.skipNotification
  );

  return handleCommonHttpError(error, !isSilent);
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(handleRequest, handleRequestError);
axiosClient.interceptors.response.use(
  handleResponse as unknown as (
    value: AxiosResponse,
  ) => AxiosResponse | Promise<AxiosResponse>,
  handleResponseError,
);

export default axiosClient;
