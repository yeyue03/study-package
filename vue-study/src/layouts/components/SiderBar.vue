<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      :selectedKeys="selectedKeys2"
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
          <router-link :to="item.path" @click="selectMenu(item)">{{ item.name }}</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const selectedKeys2 = computed(() => {
      const key = store.getters['getSiderNavKey'];
      return [key];
    })

    const openKeys = computed(() => {
      const key = store.getters['getSiderOpenKey'];
      return [key];
    })

    const menuList = computed(() => {
      return store.getters['getMenu'];
    })

    const subNavList = computed(() => {
      const navKey = store.state.user.headNavKey;
      const arr = menuList.value.filter(item => item.key == navKey);
      if (arr && arr.length) {
        return arr[0].childrens;
      } else {
        return [];
      }
    })

    const navTabList = computed(() => {
      return store.getters['getNavTab'];
    })

    const selectMenu = (item) => {
      const hadList = navTabList.value;
      let _bool = true;
      for (const obj of hadList) {
        if (item.key == obj.key) {
          _bool = false;
          break;
        }
      }

      if (_bool) {
        store.dispatch('pushNavTab', item);
      }
    }

    return {
      selectedKeys2,
      openKeys,
      collapsed: ref(false),
      subNavList,
      selectMenu,
    }
  },
})
</script>
