<template>
  <div>
    <div class="home-title">首页</div>
    <router-link to="/device">
      <a-button type="primary">跳转device</a-button>
    </router-link>
  </div>
</template>

<style lang="less" scoped>
.home-title {
  background: @bgColor;
}
</style>