import { AxiosRequestConfig, AxiosResponse } from "axios"

export interface AxiosRequestConfigWithUrl extends Omit<AxiosRequestConfig, "url"> {
  url: string
}

export interface AxiosServiceRequestParams {
  endpoint: string
  config: AxiosRequestConfigWithUrl
  expires?: number
  callback?: (response: AxiosResponse) => void
}
