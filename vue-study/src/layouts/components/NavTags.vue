<template>
  <div class="tags-wrap">
    <template v-for="(item, index) in navTabList" :key="item.key">
      <a-tag
        class="tags"
        :color="nowPath == item.path ? '#2db7f5' : null"
        :closable="item.path != '/home'"
        @close.prevent="handleClose(item, index)"
        @contextmenu.prevent="openMenu($event, item)"
      >
        <router-link :to="item.path">{{ item.name }}</router-link>

        <ul
          v-show="floatVisible && floatKey == item.key"
          class="float-menu"
          :style="{ left: floatLeft + 'px', top: floatTop + 'px' }"
        >
          <li @click.stop="handleClose(item, index)">关闭</li>
          <li @click.stop="cleartags($route.path)">关闭所有</li>
        </ul>
      </a-tag>
    </template>
  </div>
</template>

<script>
import { ref, computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "NavTags",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const floatVisible = ref(false);
    const floatKey = ref();
    const floatLeft = ref(0);
    const floatTop = ref(0);

    const nowPath = ref(route.fullPath);
    watch(route, (newRoute) => {
      nowPath.value = newRoute.fullPath;
    });

    const closeMenu = () => {
      floatVisible.value = false;
    }

    watch(floatVisible, (newVal) => {
      if (newVal) {
        document.body.addEventListener('click', closeMenu);
      } else {
        document.body.removeEventListener('click', closeMenu);
      }
    })

    const navTabList = computed(() => {
      return store.getters["getNavTab"];
    });

    const openMenu = (e, item) => {
      floatKey.value = item.key;
      floatVisible.value = true;
      floatLeft.value = e.offsetX;
      floatTop.value = e.offsetY;
    }

    const handleClose = (item, index) => {
      store.dispatch("deleteNavTab", index);
      floatKey.value = null;
      floatVisible.value = false;

      if (item.path != nowPath.value) {
        // 如果关闭的标签不是当前路由的话，就不跳转
        return;
      }

      let toPath = "/home";
      if (index > 0) {
        toPath = navTabList.value[index - 1].path;
      } else if (navTabList.value[index]) {
        toPath = navTabList.value[index].path;
      }

      if (toPath) {
        router.push({
          path: toPath,
        });
      }
    };

    const cleartags = () => {
      store.dispatch('setNavTab', []);
      floatKey.value = null;
      floatVisible.value = false;

      router.push({
        path: "/home",
      });
    }

    return {
      floatVisible,
      floatKey,
      floatLeft,
      floatTop,
      nowPath,
      navTabList,
      openMenu,
      handleClose,
      cleartags,
    };
  },
});

// 参考：https://www.h5w3.com/236523.html
</script>

<style lang="less" scoped>
.tags-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 10px;
  margin-bottom: 15px;
  background: #fff;
  box-sizing: border-box;
  .ant-tag {
    position: relative;
    padding: 2px 10px;
    :deep(.ant-tag-close-icon) {
      margin-left: 5px;
    }
  }
}

.float-menu {
  margin: 0;
  background: #fff;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>