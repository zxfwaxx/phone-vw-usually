// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import axios from 'axios'

const baseURL = process.env.VUE_APP_API_BASE_URL

// 创建 axios 实例
const service = axios.create({
  baseURL: baseURL, // api base_url
  timeout: 90000 // 请求超时时间
})


// request interceptor
service.interceptors.request.use(config => {
  const token = 'token'
  if (token) {
    config.headers['token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code === 200) {
    return response.data
  } else {
    return response.data
  }
}, err)

//错误函数
const err = (error) => {
    if (error.response) {
// eslint-disable-next-line no-unused-vars
    const data = error.response.data
  }
  return Promise.reject(error)
}



const installer = {
  vm: {},
  install (Vue) {
    Vue.use(service)
  }
}

export {
  installer as VueAxios,
  service as axios,
}
