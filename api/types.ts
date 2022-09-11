import { AxiosRequestConfig, AxiosResponse } from "axios"

export interface AxiosRequestConfigWithUrl extends Omit<AxiosRequestConfig, "url"> {
  url: string
}

export type Expires = number | undefined

export interface AxiosServiceRequestParams {
  endpoint: string
  config: AxiosRequestConfigWithUrl
  expires?: Expires
  callback?: (response: AxiosResponse) => void
}

export interface AxiosServiceReturnRequestConfig extends AxiosRequestConfigWithUrl {
  expires?: Expires
}
