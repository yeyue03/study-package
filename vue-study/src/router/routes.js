import Layout from "@/layouts/index.vue";

const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: {
          name: '主页',
          key: 'home',
          headKey: '01',
          parentKey: '01-01',
        }
      }
    ]
  },
];

export default routes;