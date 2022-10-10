<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu
      :selectedKeys="selectedKeys1"
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
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'HeaderBar',
  setup() {
    const store = useStore();
    const route = useRoute();

    const selectedKeys1 = computed(() => {
      const key = store.getters['getHeadNavKey'];
      return [key];
    })

    const menuList = computed(() => {
      return store.getters['getMenu'];
    })


    const selectMenu = (e) => {
      store.dispatch('setHeadNavKey', [e.key]);
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
    margin-right: 50px;
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
