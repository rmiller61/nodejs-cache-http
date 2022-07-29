import { AxiosRequestConfig } from "axios"

export type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

export interface AxiosServiceRequestConfig extends AxiosRequestConfig {
  data?: {
    url: string
    data: AxiosRequestConfig
  }
}
