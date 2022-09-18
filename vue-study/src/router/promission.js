import routes from "./routes";
import router from "./index";
import { useStore } from "vuex";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 动态路由的配置
let getRouter;
router.beforeEach((to, from, next) => {
  const store = useStore();
  console.log("===== 进入路由", store);
  NProgress.start();
  // 在具体的项目中还涉及到跳转登录、用户session信息等，需要处理更详细些，否则会有死循环
  if (!getRouter) {
    // 没有路有，先拿到动态路由
    // getRouter = handleRoutes(routes);
    routerGo(to, next);
    NProgress.done();
  } else {
    next();
    NProgress.done();
  }
})

router.afterEach(() => {
  NProgress.done();
})

function handleRoutes(menuList) {
  if (!menuList || menuList.length === 0) {
    return false
  }
  let whiteList = ['55555', '12']
  let userId = localStorage.getItem('wx')
  for (let i in whiteList) {
    if (whiteList[i] === userId) {
      // 按照自己项目逻辑做不同的处理
      // menuList.push({
      //   path: '/tem',
      //   name: 'Tem',
      //   component: () => import('../pages/Tem/index.vue')
      // })
      break;
    }
  }
  return [...menuList]
}

function routerGo(to, next) {
  const defaultRoutes = routes;
  getRouter = filterAsyncRouter(defaultRoutes);
  getRouter.forEach((val, idx) => {
    router.addRoute(val)
  })
  next({
    ...to,
    replace: true
  })
}

const routerList = [
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

const loadView = (view) => {
  return (resolve) => import(`@/views${view}`);
}

function filterAsyncRouter(RouterMap) {

  const accessedRouters = routerList.filter(route => {
    route.component = loadView(route.path);
    return true
  })

  for (const item of RouterMap) {
    if (item.path == '/') {
      item.children = accessedRouters;
    }
  }

  return RouterMap;
}

// 参考：https://www.cnblogs.com/xingnizhiren/p/16169977.html