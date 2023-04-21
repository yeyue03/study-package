<template>
  <div class="context-box">
    <div class="sidebar-wrap">
      <Sidebar />
    </div>

    <div class="main-wrap">
      <TopBar :pageName="pageName" @changePageName="changePageName" />

      <div class="placeholder-wrap">
        <div :class="{'placeholder': true, 'absolute-box': pageName != 'Editor'}">
          <ControlRoom />
        </div>

        <div :class="{'placeholder': true, 'absolute-box': pageName == 'Editor'}">
          <ChartPanel :pageName="pageName" />
        </div>
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
  position: relative;
  width: 100%;
  height: 100%;
  color: #fff;
}
.sidebar-wrap {
  z-index: 20;
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  min-width: 200px;
  height: 100%;
  background: #aaa;
  border: solid 1px #eee;
}
.main-wrap {
  width: 100%;
  height: 100%;
  padding-left: 200px;
  position: relative;
  background: #333;
  box-sizing: border-box;

  .placeholder-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .absolute-box {
    position: absolute;
    top: -2000px;
    right: 2000px;
  }
}
</style>
