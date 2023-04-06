<template>
  <div class="container panel-wrap">
    <div class="panel-left">
      <div class="tiles-wrap">
        <div class="tiles">
          <span class="tile-amount">300</span>
          <span class="tile-title">发稿数</span>
        </div>

        <div class="tiles">
          <span class="tile-amount">300</span>
          <span class="tile-title">发稿数</span>
        </div>

        <div class="tiles">
          <span class="tile-amount">300</span>
          <span class="tile-title">发稿数</span>
        </div>

        <div class="tiles">
          <span class="tile-amount">300</span>
          <span class="tile-title">发稿数</span>
        </div>

        <div class="tiles">
          <span class="tile-amount">300</span>
          <span class="tile-title">发稿数</span>
        </div>
      </div>

      <div class="echarts-wrap">
        <a-row algin="middle" justify="space-between">
          <div>
            <HTitle>大部门人数比</HTitle>
            <PieCharts echartId="pie01" style="width: 380px; height: 260px" />
          </div>

          <div>
            <HTitle>部门资源利用率</HTitle>
            <BarChart echartId="bar01" style="width: 380px; height: 260px" />
          </div>
        </a-row>

        <a-row algin="middle" justify="space-between">
          <div>
            <HTitle>项目投入人数</HTitle>
            <BarChart echartId="bar02" style="width: 380px; height: 260px" />
          </div>

          <div>
            <HTitle>项目收益比</HTitle>
            <PieCharts echartId="pie02" style="width: 380px; height: 260px" />
          </div>
        </a-row>

        <StackedAreaChart echartId="area" style="width: 300px; height: 400px" />
      </div>
    </div>

    <div class="panel-right">
      <NoticeList title="消息推送" />

      <div class="shortcut-wrap">
        <template v-for="item in 10" :key="item">
          <div class="shortcut">
            <home-outlined style="fontsize: 35px" />
            <span>服务平台</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import StackedAreaChart from "./components/StackedAreaChart.vue";
import NoticeList from "./components/NoticeList.vue";
import PieCharts from "./components/PieCharts.vue";
import BarChart from "./components/BarChart.vue";
import HTitle from "../../components/other/HTitle.vue";
import { HomeOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "Home02",
  components: {
    StackedAreaChart,
    NoticeList,
    PieCharts,
    BarChart,
    HTitle,
    HomeOutlined,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="less" scoped>
.panel-wrap {
  display: flex;
}
.panel-left {
  width: 800px;
}
.panel-right {
  width: 350px;
  margin-left: 20px;
}

.tiles-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .tiles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    margin: 10px;
    background: #ccccff;
    border-radius: 10px;
    .tile-title {
      line-height: 20px;
      color: #3c495c;
    }
    .tile-amount {
      font-size: 32px;
      font-weight: 700;
      line-height: 56px;
    }
  }
  .tiles:first-child {
    background: #ffee99;
  }
  .tiles:nth-child(2) {
    background: #33ccff;
  }
  .tiles:nth-child(3) {
    background: #ffff99;
  }
  .tiles:nth-child(4) {
    background: #00ff00;
  }
  .tiles:nth-child(5) {
    background: #33ffff;
  }
}
.echarts-wrap {
  width: 100%;
}

.shortcut-wrap {
  display: flex;
  flex-wrap: wrap;
  .shortcut {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90px;
    margin: 8px 12px;
    span {
      margin-top: 10px;
      font-size: 14px;
    }
  }
}
</style>
