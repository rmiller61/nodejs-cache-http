// From: https://gist.github.com/paulsturgess/ebfae1d1ac1779f18487d3dee80d1258
import axios, { AxiosInstance, AxiosResponse } from "axios"
import { AxiosServiceReturnRequestConfig, AxiosServiceRequestParams } from "./types"

class AxiosService {
  constructor() {
    const service = axios.create()
    this.service = service
  }

  service: AxiosInstance

  request({
    endpoint,
    config,
    expires,
    callback,
  }: AxiosServiceRequestParams): Promise<AxiosResponse> {
    const data: AxiosServiceReturnRequestConfig = {
      ...config,
      expires,
    }
    return (
      this.service
        .request({
          url: endpoint,
          method: "POST",
          data,
        })
        .then((response) => {
          if (callback) {
            callback(response)
          }
          return response
        })
        // Call the original axios request on error
        .catch((error) => {
          console.log(`ERROR: ${JSON.stringify(error)}`)
          return this.service.request(config)
        })
    )
  }
}

export default new AxiosService()
