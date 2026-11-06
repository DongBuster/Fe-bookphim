import axios from 'axios';

import type { IOriginRequest } from '@config/axios-instance';
import axiosClient from '@config/axios-instance';
import { LOGIN_PATH } from '@shared/constants/path';
import tokenManager from './tokenManager';
interface IFailedQueue {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

// for multiple requests
let isRefreshing = false;
let failedQueue: IFailedQueue[] = [];

const processQueue = (error: Error | null, token: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const handleRefreshToken = async (originalRequest: IOriginRequest) => {
  if (isRefreshing) {
    return new Promise(function (resolve, reject) {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = 'Bearer ' + token;
        }
        return axiosClient(originalRequest);
      })
      .catch((err) => err);
  }

  originalRequest._retry = true;
  isRefreshing = true;

  return new Promise(function (resolve, reject) {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      const err = new Error('No refresh token available');
      processQueue(err, null);
      tokenManager.removeAccessToken();
      tokenManager.removeRefreshToken();
      window.location.href = LOGIN_PATH;
      reject(err);
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh-token`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then(({ data }) => {
        // Trường hợp refresh token hết hạn hoặc backend báo lỗi
        if (!data?.data || data?.success === false) {
          isRefreshing = false;
          const err = new Error(data?.message || 'Phiên đăng nhập đã hết hạn.');
          tokenManager.removeAccessToken();
          tokenManager.removeRefreshToken();
          processQueue(err, null);
          window.location.href = LOGIN_PATH;
          reject(err);
          return;
        }

        tokenManager.setAccessToken(data.data.accessToken);
        tokenManager.setRefreshToken(data.data.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] =
            'Bearer ' + data.data.accessToken;
        }

        processQueue(null, data.data.accessToken);
        resolve(axiosClient(originalRequest));
      })
      .catch((err) => {
        console.log('refresh token err: ', err);
        tokenManager.removeAccessToken();
        tokenManager.removeRefreshToken();
        processQueue(err, null);
        window.location.href = LOGIN_PATH;
        reject(err);
      })
      .finally(() => {
        isRefreshing = false;
      });
  });
};
