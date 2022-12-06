import routes from "./routes";
import router from "./index";
import store from "../store";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import UserApi from '@/api/user';

// 动态路由的配置
let getRouter;
router.beforeEach(async (to, from, next) => {
  if (to.path == '/') {
    next('/home');
    return
  }

  const menuList = store.state.user.menuList;
  NProgress.start();
  
  // 在具体的项目中还涉及到跳转登录、用户session信息等，需要处理更详细些，否则会有死循环
  if (!menuList || !menuList.length) {
    const res = await UserApi.GetMenu();
    if (res.code == 200) {
      store.dispatch('setMenu', res.data || []);
    }
  }

  if (!getRouter) {
    // 没有路有，先拿到动态路由
    // getRouter = handleRoutes(routes);
    routerGo(to, next);
  } else {
    next();
  }
  NProgress.done();
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
  getRouter.push({ path: '/:catchAll(.*)', redirect: '/home' });
  console.log("=== getRouter", getRouter);

  getRouter.forEach(val => {
    router.addRoute(val);
  })
  next({...to, replace: true })
}

let asyncRouteArr = [];
const loadView = (menuList) => {
  for (const item of menuList) {
    if (item.childrens && item.childrens.length) {
      loadView(item.childrens);
      
    } else {
      asyncRouteArr.push({
        path: item.path,
        name: item.componentName,
        component: () => import(`@/views${item.path}`),
        meta: {
          name: item.name,
          key: item.key,
          headKey: item.headKey,
          parentKey: item.parentKey
        }
      })
    }
  }
}

function filterAsyncRouter(RouterMap) {
  const menuList = store.state.user.menuList;
  asyncRouteArr = [];
  loadView(menuList);

  for (const item of RouterMap) {
    if (item.path == '/') {
      item.children.push(...asyncRouteArr);
    }
  }

  return RouterMap;
}

// 参考：https://www.cnblogs.com/xingnizhiren/p/16169977.html