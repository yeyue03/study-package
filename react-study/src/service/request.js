import axios from 'axios';

import { BASE_URL, TIMEOUT} from './config';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'content-type': 'multipart/form-data' },
  timeout: TIMEOUT
})

//添加拦截
instance.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJoZXpoZW4iLCJzY29wZSI6WyJhbGwiXSwiYWNjb3VudFR5cGUiOjAsImlkIjoxMTksImV4cCI6MTY1NzY5MzQ5OCwiYXV0aG9yaXRpZXMiOlsi566h55CG5ZGYIiwi6ZSA5ZSu5Luj6KGoIiwi5a6i5pyN5Luj6KGoIl0sImp0aSI6IjFiMzRjMzI1LWY5YmMtNGNiOC04ZTdiLWQ2YmIwOWM2NWZiMCIsImNsaWVudF9pZCI6ImdhdGV3YXkifQ.d7RQHO02RKaRjAGJv6Mp03gwjg2bDZBJUOAHipWlRNcR6WuInQIZN3DKC3WvBMIf_OLMq_qZW5dSASdvDZqVlCry_N6ewib2Hg8GdeOOmzP-5CbPGzfjrmwXBQFvC2yQ9CrAWBBJScMXEC5DM0fIiFGJlsx3M68Kk5IoE7m2RJCybcHLeh0_65Sx_PavzebQom8O8YDoOc542h2gg95vlBqiWs3I_R6oFscLlvR9vRtsw22ci2js99HYshsJJn5nV6-feyoR7g9cXC5ol9YWkTOZK30h6sHIYPk8VGHMahBYFqrp8gmLzr9790wot4ZscdcDtZcKVQkZJU6NnUIwYg';
  return config

}, error => {
  console.log("接口报错：", error);
})

instance.interceptors.response.use(res => {
  if (res.data.code === 200) {
    return res.data;
  } else {
    return Promise.reject(res.data.message || 'Error' );
  }

},error => {
  return error;
})

export default instance;
