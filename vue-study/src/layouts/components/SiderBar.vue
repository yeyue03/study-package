<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      v-model:selectedKeys="selectedKeys2"
      v-model:openKeys="openKeys"
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
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
  },
  setup() {
    const store = useStore();
    const menuList = computed(() => {
      return store.getters['getMenu'];
    })

    const subNavList = computed(() => {
      const navKey = store.state.user.nowNavKey;
      const arr = menuList.value.filter(item => item.key == navKey);
      if (arr && arr.length) {
        return arr[0].childrens;
      } else {
        return [];
      }
    })

    return {
      selectedKeys2: ref(['1']),
      collapsed: ref(false),
      openKeys: ref(['sub1']),
      subNavList,
    }
  },
})
</script>
