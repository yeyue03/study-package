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
import { defineComponent } from "vue";

import HeaderBar from "./components/HeaderBar.vue";
import SiderBar from "./components/SiderBar.vue";
import Content from "./components/Content.vue";
import NavTags from "./components/NavTags.vue";

export default defineComponent({
  components: {
    HeaderBar,
    SiderBar,
    Content,
    NavTags,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.layout-warp {
  width: 100%;
  height: 100%;
}
</style>
