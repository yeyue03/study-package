import { createRouter, createWebHistory } from "vue-router";
// import Home from "@/views/Home.vue";
import Layout from "@/layouts/index.vue";

const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: '/demo/list',
        name: 'DemoList',
        component: () => import('@/views/demo/list')
      },
      {
        path: '/demo/detail',
        name: 'DemoDetail',
        component: () => import('@/views/demo/detail')
      },
      {
        path: '/demo/table',
        name: 'DemoTable',
        component: () => import('@/views/demo/table')
      },
      {
        path: '/',
        redirect: '/demo/list'
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
