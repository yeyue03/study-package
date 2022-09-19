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
import { useStore } from 'vuex';

import HeaderBar from './components/HeaderBar.vue';
import SiderBar from './components/SiderBar.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import Content from './components/Content.vue';

import UserApi from '@/api/user';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    HeaderBar,
    SiderBar,
    Breadcrumb,
    Content
  },
  setup() {
    const store = useStore();
    const route = useRoute();

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

