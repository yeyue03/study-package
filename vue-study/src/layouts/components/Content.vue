<template>
  <a-layout-content class="container">
    <router-view></router-view>
  </a-layout-content>
</template>

<style scoped>
.container {
  min-height: 280px;
  margin: 0;
  padding: 20px;
  background: #fff;
  overflow-y: auto;
}
</style>