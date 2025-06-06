import axios, { AxiosInstance, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';

const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('token');
    
    if (token) {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }

    config.withCredentials = true;

    // console.log('Requisição Interceptada:', config);
    return config;
  },
  (error) => {
    // console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('Resposta Interceptada:', response);
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403)   {
      window.location.href ='/sign-in';
    }
    // console.error('Erro na resposta:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
