<template>
  <div class="tags-wrap">
    <template v-for="item in navTabList" :key="item.key">
      <a-tag :color="route.path == item.path ? '#2db7f5' : null" closable @close.prevent>
        <router-link :to="item.path">{{ item.name }}</router-link>
      </a-tag>
    </template>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'NavTags',
  setup() {
    const store = useStore();
    const route = useRoute();
    console.log("==== store", store);

    const navTabList = computed(() => {
      return store.getters['getNavTab'];
    })

    return {
      route,
      navTabList
    }
  },
})

// 参考：https://www.h5w3.com/236523.html
</script>

<style scoped>
.tags-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  margin-bottom: 15px;
  background: #fff;
  box-sizing: border-box;
}
</style>