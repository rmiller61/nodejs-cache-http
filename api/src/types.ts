import { AxiosRequestConfig } from "axios"

export interface AxiosRequestConfigWithUrl extends Omit<AxiosRequestConfig, "url"> {
  url: string
}
