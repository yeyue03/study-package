<template>
  <a-row>
    <a-button @click="showMainType = 'control'">坐标系</a-button>
    <a-button @click="showMainType = 'chart'">折线图</a-button>
  </a-row>
  <div class="context-box">
    <div class="sidebar-wrap">
      <Sidebar />
    </div>

    <div class="main-wrap">
      <div class="placeholder" v-show="showMainType == 'control'">
        <ControlRoom />
      </div>

      <div class="placeholder" v-show="showMainType == 'chart'">
        <ChartPanel />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import Sidebar from './sidebar';
import ControlRoom from './control';
import ChartPanel from './chartPanel';

export default defineComponent({
  name: "ProjectCharts",
  components: {
    Sidebar,
    ControlRoom,
    ChartPanel
  },
  setup() {
    const showMainType = ref('control')

    return {
      showMainType,
    };
  },
});
</script>

<style lang="less" scoped>
.context-box {
  display: flex;
  width: 100%;
  height: 90%;
  color: #fff;
}
.sidebar-wrap {
  width: 200px;
  height: 100%;
  background: #aaa;
  border: solid 1px #eee;
}
.main-wrap {
  position: relative;
  flex: 1;

  .placeholder {
    width: 100%;
    height: 100%;
  }
}
</style>
