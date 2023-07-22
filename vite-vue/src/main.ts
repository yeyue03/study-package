import { createApp } from 'vue'
import 'ant-design-vue/dist/antd.css'
import '@/assets/font/iconfont.css';
import './style.css'
// import '@/hooks/web/useI18n';

import Antd from 'ant-design-vue';
import App from './App.vue'

import router from './router'

createApp(App).use(router).use(Antd).mount('#app')
