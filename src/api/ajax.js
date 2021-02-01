import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'

const domain = window.location.protocol + '//' + window.location.host
// const domain = 'https://ymht.liantuofu.com'
const service = axios.create({
  withCredentials: true,
  baseURL: domain,
  headers: { 'Access-Control-Allow-Origin': '*' }
})
service.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    response.status != 200 && message.info('服务器连接失败，请查看网络连接！')
    return response.data
  },
  error => Promise.reject(error)
)

export const post = (url, data, config = {}) => {
  const formData = new FormData()
  for (let i in data) {
    formData.append(i, data[i])
  }
  return service({
    method: 'post',
    url,
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data'
    },
    ...config
  })
}

export const get = (url, params) => {
  return service({
    method: 'get',
    url,
    params
  })
}
