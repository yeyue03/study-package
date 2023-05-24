import { createApp } from 'vue'
import 'ant-design-vue/dist/antd.css'
import './style.css'

import Antd from 'ant-design-vue';
import App from './App.vue'

import router from './router'

createApp(App).use(router).use(Antd).mount('#app')
