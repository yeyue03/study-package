<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu
      :selectedKeys="selectedHeadNav"
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
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderBar',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const selectedHeadNav = computed(() => {
      const key = store.getters['getHeadNavKey'];
      return [key];
    })

    const menuList = computed(() => {
      return store.getters['getMenu'];
    })

    const selectMenu = (e) => {
      const arr = menuList.value.filter(item => item.key == e.key);
      if (arr && arr.length) {
        const list = arr[0].childrens || [];

        if (list.length) {
          for (const obj of list) {
            if (obj.childrens.length) {

              router.push({
                path: obj.childrens[0].path
              })
              break;
            }
          }
        }

      }
    }

    return {
      menuList,
      selectedHeadNav,
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
