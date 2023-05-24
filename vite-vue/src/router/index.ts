import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from '@/views/home/index.vue';
 
// 路由类型:RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: 'Home',
    component: Home,
  },
  {
    path: '/device',
    name: 'Device',
    component: () => import('@/views/device/controller/index.vue')
  }
];
 
const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});
 
export default router;