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

export default routes;