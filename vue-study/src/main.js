import { createApp } from "vue";
import Antd from 'ant-design-vue';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'ant-design-vue/dist/antd.css';

import './router/promission';
import mock from './mock';

import globalComponents from '@/components';

createApp(App).use(store).use(router).use(Antd).use(globalComponents).mount("#app");
