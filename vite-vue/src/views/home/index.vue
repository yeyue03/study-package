<template>
  <div>
    <div class="home-title">首页</div>
    <router-link to="/device">
      <a-button type="primary">跳转device</a-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserApi from '@/api/user.api'

export default defineComponent({
  name: 'Home',
  setup() {
    UserApi.GetMenu().then((res: any) => {
      console.log("=== res: ", res);
      
    }).catch((err: any) => {
      console.log("=== err: ", err);
    });

    return {

    }
  },
})
</script>


<style lang="less" scoped>
.home-title {
  background: @bgColor;
}
</style>