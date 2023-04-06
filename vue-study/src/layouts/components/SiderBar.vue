<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      :selectedKeys="selectedSiderNav"
      :openKeys="openKeys"
      mode="inline"
      :style="{ height: '100%', borderRight: 0 }"
    >
      <a-sub-menu v-for="subObj in subNavList" :key="subObj.key">
        <template #title>
          <span>
            <user-outlined />
            {{ subObj.name }}
          </span>
        </template>
        <a-menu-item v-for="item in subObj.childrens" :key="item.key">
          <router-link :to="item.path">{{ item.name }}</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { UserOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    UserOutlined,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const openKeys = ref([]);
    const subNavList = ref([]);

    const menuList = computed(() => {
      return store.getters["getMenu"];
    });

    const navTabList = computed(() => {
      return store.getters["getNavTab"];
    });

    const headNavKey = computed(() => {
      return store.getters["getHeadNavKey"];
    });

    const selectedSiderNav = computed(() => {
      const key = store.getters["getSiderNavKey"];
      return [key];
    });

    // 判断菜单是否已打开过
    const isHadTab = (key) => {
      const hadList = navTabList.value;
      let _bool = false;
      for (const obj of hadList) {
        if (key && key == obj.key) {
          _bool = true;
          break;
        }
      }

      return _bool;
    };

    // 设置侧边栏导航数组 且默认打开该模块下第一个页面
    const setSiderNav = (headNavKey) => {
      const arr = menuList.value.filter((item) => item.key == headNavKey);
      if (arr && arr.length) {
        const list = arr[0].childrens || [];
        subNavList.value = list;
        openKeys.value = [route.meta.parentKey];
      }
    };

    // 设置导航相关store
    const setNavStore = (route) => {
      const meta = route.meta;

      if (meta.headKey != headNavKey.value) {
        setSiderNav(meta.headKey);
      } else {
        if (openKeys.value.indexOf(meta.parentKey) == -1) {
          openKeys.value.push(meta.parentKey);
        }
      }

      store.dispatch("setHeadNavKey", meta.headKey);
      store.dispatch("setSiderNavKey", meta.key);

      const _bool = isHadTab(meta.key);
      if (!_bool) {
        const tabObj = {
          path: route.fullPath,
          ...meta,
        };
        store.dispatch("pushNavTab", tabObj);
      }
    };

    // 初次进入页面时
    if (route?.meta.key) {
      setNavStore(route);
    }

    // 监听路由
    watch(route, (newRoute) => {
      setNavStore(newRoute);
    });

    // 监听顶部导航栏切换
    watch(headNavKey, (newVal) => {
      subNavList.value = [];
      setSiderNav(newVal);
    });

    return {
      selectedSiderNav,
      openKeys,
      collapsed: ref(false),
      subNavList,
    };
  },
});
</script>
