import { deleteCookie, getCookie, setCookie } from "./cookie";
import { convertKeysToCamelCase } from "./snake-to-camel";
import type { TDelivery } from "./types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TRefreshResponse = {
  refresh: string;
  access: string;
};

export const refreshToken = (): Promise<TRefreshResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available"));
  }

  return fetch(`${SERVER_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      localStorage.setItem("refreshToken", refreshData.refresh);
      setCookie("accessToken", refreshData.access);
      return refreshData;
    });
};

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    // Проверяем, что ошибка именно 401 Unauthorized
    if (err instanceof Error && err.message.includes("401")) {
      try {
        console.log("Trying to refresh token...");
        const refreshData = await refreshToken();

        // Сохраняем новый токен
        setCookie("accessToken", refreshData.access);
        localStorage.setItem("refreshToken", refreshData.refresh);

        // Создаем КОПИЮ options с обновленным заголовком
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${refreshData.access}`,
          },
        };

        console.log("Retrying request with new token...");
        const res = await fetch(url, newOptions);
        return await checkResponse<T>(res);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Обработка неудачного обновления токена
        deleteCookie("accessToken");
        localStorage.removeItem("refreshToken");
        throw new Error("Session expired. Please log in again.");
      }
    }
    // Если ошибка не 401 - пробрасываем дальше
    throw err;
  }
};

type TLoginResponse = {
  access: string;
  refresh: string;
};

type TOrdersResponse = {
  orders: TDelivery[];
};

export type TLoginData = {
  username: string | undefined;
  password: string | undefined;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${SERVER_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TLoginResponse>(res))
    .then((data) => {
      if (data) {
        return data;
      }
      return Promise.reject(data);
    });

export const getTokenVerify = () =>
  fetchWithRefresh(`${SERVER_URL}/token/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    } as HeadersInit,
    body: JSON.stringify({ token: getCookie("accessToken") }),
  }).then((data) => {
    if (data) {
      return data;
    }
    return Promise.reject(data);
  });

export const getOrdersApi = () =>
  fetchWithRefresh(`${SERVER_URL}/orders/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + getCookie("accessToken"),
    } as HeadersInit,
  }).then((data) => {
    if (data) {
      const formatData: TOrdersResponse = convertKeysToCamelCase(data);
      return formatData;
    }
    return Promise.reject(data);
  });
