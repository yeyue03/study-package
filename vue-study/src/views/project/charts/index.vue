<template>
  <div class="context-box">
    <div class="sidebar-wrap">
      <Sidebar />
    </div>

    <div class="main-wrap">
      <TopBar :pageName="pageName" @changePageName="changePageName" />

      <div class="placeholder" v-show="pageName == 'Editor'">
        <ControlRoom />
      </div>

      <div class="placeholder" v-show="pageName == 'Protocol' || 'Simulation'">
        <ChartPanel :pageName="pageName" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import Sidebar from './sidebar';
import TopBar from './topBar';
import ControlRoom from './control';
import ChartPanel from './chartPanel';

export default defineComponent({
  name: "ProjectCharts",
  components: {
    Sidebar,
    TopBar,
    ControlRoom,
    ChartPanel
  },
  setup() {
    const pageName = ref('Editor')

    const changePageName = name => {
      pageName.value = name;
    }

    return {
      pageName,
      changePageName
    };
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
.sidebar-wrap {
  width: 200px;
  height: 100%;
  background: #aaa;
  border: solid 1px #eee;
}
.main-wrap {
  position: relative;
  flex: 1;
  background: #333;

  .placeholder {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
