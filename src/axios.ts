// From: https://gist.github.com/paulsturgess/ebfae1d1ac1779f18487d3dee80d1258
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

export default class AxiosService {
  constructor(args: AxiosRequestConfig = {}) {
    const service = axios.create(args)
    this.service = service
  }

  service: AxiosInstance

  request(args: AxiosRequestConfig = {}, callback: (response?: AxiosResponse) => void = () => {}) {
    return this.service.request(args).then((response) => callback(response))
  }
}
