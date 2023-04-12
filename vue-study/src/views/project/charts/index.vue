<template>
  <div class="context-box">
    <div class="sidebar-wrap">
      <Sidebar />
    </div>

    <div class="main-wrap">
      <div class="options-wrap">
        <OptionsBtn />
      </div>

      <div class="charts-wrap">
        <ControlRoom />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Sidebar from './components/Sidebar.vue';
import OptionsBtn from "./components/OptionsBtn.vue";
import ControlRoom from './components/ControlRoom.vue';

export default defineComponent({
  name: "ProjectCharts",
  components: {
    Sidebar,
    OptionsBtn,
    ControlRoom
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
.sidebar-wrap {
  width: 200px;
  height: 100%;
  background: #eee;
}
.main-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;

  .options-wrap {
    width: 100%;
    height: 40px;
  }

  .charts-wrap {
    flex: 1;
    width: 100%;
    padding: 50px 0;
    background: #333;
  }
}
</style>
