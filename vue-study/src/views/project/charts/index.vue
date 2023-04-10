<template>
  <div class="context-box">
    <div class="sidebar-box">
      <Sidebar />
    </div>

    <div class="main-box">
      <div class="options-box">
        顶部操作栏
      </div>

      <div class="charts-box">
        图表
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Sidebar from './components/Sidebar.vue';

export default defineComponent({
  name: "ProjectCharts",
  components: {
    Sidebar
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped>
.context-box {
  display: flex;
  width: 100%;
  height: 100%;
  color: #fff;
}
.sidebar-box {
  width: 200px;
  height: 100%;
  background: #eee;
}
.main-box {
  display: flex;
  flex: 1;
  flex-direction: column;

  .options-box {
    width: 100%;
    height: 40px;
    border: solid 1px #333;
  }

  .charts-box {
    flex: 1;
    border: solid 1px #333;
  }
}
</style>
