import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import '@/assets/font/iconfont.css';

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import horizontalScroll from './utils/el-scorll'

import "./router/promission";
import "./mock";

import globalComponents from "@/components";

createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .use(horizontalScroll)
  .use(globalComponents)
  .mount("#app");
