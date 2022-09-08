import axios from 'axios'
import {
  message
} from 'ant-design-vue'

// 请求超时时间
const service = axios.create({
  timeout: 10000,
  baseURL: '/api',
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = session.get('Token')
    // token && (config.headers.Authorization = token)
    // if(config.method.toUpperCase() === 'POST') {
    //   config.headers['Content-Type'] = 'application/json;charset=utf-8'
    // }
    return config
  },
  error => {
    return Promise.error(error)
  })

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200 && response.data.code === 200) {
      return Promise.resolve(response)
    } else {
      if (response.data.message) {
        message.error(response.data.message);
      }
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          message.error('网错错误，请稍后再试！')
          break
        case 404:
          message.error('为找到接口，请联系管理员！')
          break
          // 其他错误，直接抛出错误提示
        default:
          message.error(error.response.data.message)
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * get方法，对应get请求,直接在地址后面拼串的形式
 * @param {String} url [请求的url地址]
 * @param {String} params [请求时携带的参数]
 */
export function getDynamicynamic(url, params) {
  return new Promise((resolve, reject) => {
    const completeUrl = `${url}/${params}`
    service.get(completeUrl, {})
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}