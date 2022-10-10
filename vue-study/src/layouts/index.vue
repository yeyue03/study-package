<template>
  <a-layout class="layout-warp">
    <HeaderBar />
    <a-layout>
      <SiderBar />
      <a-layout style="padding: 0 20px 20px">
        <NavTags />
        <Content />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import HeaderBar from './components/HeaderBar.vue';
import SiderBar from './components/SiderBar.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Content from './components/Content.vue';
import NavTags from './components/NavTags.vue';

import UserApi from '@/api/user';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    HeaderBar,
    SiderBar,
    Breadcrumb,
    Content,
    NavTags
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const setNavStore = (route) => {
      const meta = route.meta;
      store.dispatch('setHeadNavKey', meta.navKey);
      store.dispatch('setSiderNavKey', meta.key);
      store.dispatch('setSiderOpenKey', meta.parentKey);
    }

    if (route?.meta.key) {
      const obj = {
        path: route.fullPath,
        ...route.meta
      }
      store.dispatch('pushNavTab', obj);

      setNavStore(route);
    }

    watch(route, (newRoute) => {
      setNavStore(newRoute);
    })

    // const getMenu = () => {
    //   UserApi.GetMenu().then(res => {
    //     store.dispatch('setMenu', res.data || []);
    //   })
    // }
    // getMenu();

    return {
      
    };
  },
});
</script>

<style scoped>
.layout-warp {
  width: 100%;
  height: 100%;
}
</style>

