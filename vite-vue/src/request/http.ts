import axios, { AxiosInstance } from "axios";
// 因为是ts需要定义类型
class AxiosUtils {
  private http: AxiosInstance;
 
  constructor() {
    this.http = axios.create({
      // 根路径
      baseURL: "/api",
      // 请求延迟时间 如果超过这个时间就会断开拦截
      timeout: 3000,
      // headers: { "X-Custom-Header": "foobar" },
    });
    // 要在constructor里面进行调用 发请求的时候就要开始调用 就要对请求和响应进行拦截
    this.myAddinterceptors();
  }
  // 拦截器
  // 拦截器要自己定义一个方法.实现拦截
  private myAddinterceptors() {
        //封装的是拦截器
        //请求拦截器
        // 一般的作用是 拦截token或者请求头
    // 添加请求拦截器
    this.http.interceptors.request.use(
      function (config: any) {
        config.headers['Authorization'] = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJoZXpoZW4iLCJzY29wZSI6WyJhbGwiXSwiYWNjb3VudFR5cGUiOjAsImlkIjoxOTksImV4cCI6MTY4NjczNjE5NCwiYXV0aG9yaXRpZXMiOlsi6ZSA5ZSu5Luj6KGoIiwi6ZSA5ZSu5Li7566hIiwi5a6h5qC4566h55CGIiwi5a6i5pyN5Luj6KGoIiwi5oC757uP55CGIiwi566h55CG5ZGYIiwi6LSi5Yqh5aSN5qC4IiwiUk1BIFN1cGV2aXNvciIsIui0ouWKoeaAu-ebkeWkjeaguCJdLCJqdGkiOiI0NjAyZmJlZS05MmU1LTRhN2UtYjdmZS0yYTIxMDg3YTIzNDIiLCJjbGllbnRfaWQiOiJnYXRld2F5In0.mYZrlyoPtiCDRhC9SN5jgYqqvyiHGRkCfmITAVYR2yyYkuDy6HVVKH9K32gAp1reW5ksZ_pMW3MoRaHQ8VHfdVtcNzjn22D6N6SaLCypEJl3NzxGqN_13AItyYh-ffbXi2DyITM3Cwi_TVf7CnBdyKEx_fIN4yZLx8oc_ErdjufS8ll4zoQfZ1dlLpYVbLrR6NCcZGLMc_6hROz6edQ3EUCBhRFJjReZHtUXq8XGbDrSZnf6LWAk_pDCY7Cu1B5Z0WvIytWXNSr6aijzYBhX6FMvFN7lpdyTAcpVodjoZA8zPW4aoyi5FyQlHkQbo6NH0xDkqf3fSbyZQ3nJAhKy_Q'
        // 在发送请求之前做些什么
        return config;
      },
      function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
 
    // 添加响应拦截器
    this.http.interceptors.response.use(
      function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        //对返回的数据进行筛选
        //response.data 只取data中的值,其他的属性不要
        return response.data;
      },
      function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error);
      }
    );
  }
  // 封装一个request方法
  private request(config: any) {
    let conf: any = JSON.parse(JSON.stringify(config))
    
    return this.http({
      url: conf.url,
      method: conf.method,
      params: conf.method == "get" ? conf.data : "",
      data: conf.method == "post" ? conf.data : "",
    });
  }
 
  // public公开的,意思就是让别人用  private自己封装的 需要隐藏起来 不让别人用
  public get(config: any) {
    return this.request({ ...config, method: "GET" });
  }

  public post(config: any) {
    return this.request({ ...config, method: "POST" });
  }

  public put(config: any) {
    return this.request({ ...config, method: "PUT" });
  }
  
  public delete(config: any) {
    return this.request({ ...config, method: "DELETE" });
  }
}
 
// 新建对象
let http = new AxiosUtils();
// 把对象暴露出去
export default http;