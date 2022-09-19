<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu
      v-model:selectedKeys="selectedKeys1"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
      @select="selectMenu"
    >
      <a-menu-item v-for="item in menuList" :key="item.key">{{ item.name }}</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'HeaderBar',
  setup() {
    const store = useStore();
    const route = useRoute();

    const selectedKeys1 = ref();
    if (route?.meta.key) {
      selectedKeys1.value = [route.meta.navKey];
      store.dispatch('setNavKey', [route.meta.navKey]);
    }

    const menuList = computed(() => {
      return store.getters['getMenu'];
    })


    const selectMenu = (e) => {
      store.dispatch('setNavKey', [e.key]);
    }

    return {
      menuList,
      selectedKeys1,
      selectMenu,
    }
  },
})
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  .logo {
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
