<template>
  <div class="home">
    <div>
      <h1>首页菜单</h1>
      
      <h3>常用</h3>

      <div class="router-btn">
        <router-link to="/xlsx">
          <a-button type="primary">xlsx 导入、导出; 页面导出为pdf</a-button>
        </router-link>
      </div>

      <h3>拖拽</h3>

      <div class="router-btn">
        <router-link to="/drag/dragGrid">
          <a-button type="primary">grid 拖拽</a-button>
        </router-link>
      </div>

      <h3>其他</h3>
      
      <div class="router-btn">
        <router-link to="/device">
          <a-button type="primary">跳转device</a-button>
        </router-link>
      </div>

      <div class="home-title">测试全局less bgColor</div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserApi from "@/api/user.api";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    UserApi.GetMenu()
      .then((res: any) => {
        console.log("=== 菜单: ", res);
      })
      .catch((err: any) => {
        console.log("=== err: ", err);
      });

    return {
      
    };
  },
});
</script>


<style lang="less" scoped>
.home {
  padding: 20px;
}
.router-btn {
  margin-bottom: 20px;
}
.home-title {
  background: @bgColor;
}
</style>