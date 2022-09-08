<template>
  <a-layout class="layout-warp">
    <HeaderBar />
    <a-layout>
      <SiderBar />
      <a-layout style="padding: 0 24px 24px">
        <Breadcrumb />
        <Content />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import HeaderBar from './components/HeaderBar.vue';
import SiderBar from './components/SiderBar.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Content from './components/Content.vue';

import UserApi from '@/api/user';

export default defineComponent({
  components: {
    HeaderBar,
    SiderBar,
    Breadcrumb,
    Content
  },
  setup() {
    const menuList = ref([]);

    const getMenu = () => {
      UserApi.GetMenu().then(res => {
        menuList.value = res.data;
      })
    }
    getMenu();

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

