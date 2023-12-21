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
    path: '/xlsx',
    name: 'Xlsx',
    component: () => import('@/views/xlsx/index.vue')
  },
  {
    path: '/drag/dragGrid',
    name: 'DragGrid',
    component: () => import('@/views/drag/dragGrid/index.vue')
  },
  {
    path: '/device',
    name: 'Device',
    component: () => import('@/views/device/controller/index.vue')
  },
  {
    path: '/linkageLine',
    name: 'LinkageLine',
    component: () => import('@/views/echarts/linkageLine/index.vue')
  }
];
 
const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});
 
export default router;