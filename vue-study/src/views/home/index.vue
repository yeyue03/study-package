<template>
  <div>
    <div class="tiles-wrap">
      <div class="tile" v-for="item in tilesList" :key="item.id">
        <div class="tile-info">
          <span class="tile-amount">{{ item.amount }}</span>
          <span class="tile-title">{{ item.title }}</span>
        </div>
        <a-progress type="circle" :percent="item.percent" :width="70" :strokeColor="item.strokeColor" />
      </div>
    </div>

    <a-row justify="space-between">
      <div class="sale-info">
        <div class="title-box">
          <span class="title">本月销售情况</span>
          <span>3月</span>
        </div>
        <div class="chart-box">
          <PieCharts echartId="pie01" style="width: 100%; height: 260px" />
        </div>
      </div>

      <div class="sale-info width-66">
        <div class="title-box">
          <span class="title">产品销售统计</span>
          <span>3月</span>
        </div>
        <div class="chart-box">
          <LineChart echartId="line01" style="width: 100%; height: 260px" />
        </div>
      </div>
    </a-row>

    <a-row justify="space-between" style="margin-top: 20px;">
      <div class="sale-info">
        <div class="title-box">
          <span class="title">销售经理情况统计</span>
          <span>3月</span>
        </div>
        <div class="chart-box">
          <StatisticalTable />
        </div>
      </div>

      <div class="sale-info width-66">
        <div class="title-box">
          <span class="title">年收入情况统计</span>
          <span>3月</span>
        </div>
        <div class="chart-box">
          <BarChart echartId="homeBar" style="width: 100%; height: 260px" />
        </div>
      </div>
    </a-row>

  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import PieCharts from './components/PieCharts.vue';
import LineChart from './components/LineChart.vue';
import BarChart from './components/BarChart.vue';
import StatisticalTable from './components/StatisticalTable.vue';

export default defineComponent({
  name: "Home",
  components: {
    PieCharts,
    LineChart,
    BarChart,
    StatisticalTable,
  },
  setup() {
    const tilesList = ref([
      {
        id: 1,
        title: '新产品研发进度',
        amount: 86,
        percent: 30,
      },
      {
        id: 2,
        title: '指标数据写这里',
        amount: 248,
        percent: 26,
        strokeColor: '#e6a23c',
      },
      {
        id: 3,
        title: '执笔数据',
        amount: 352,
        percent: 26,
        strokeColor: '#e6a23c',
      },
      {
        id: 4,
        title: '年收益',
        amount: 159,
        percent: 26,
        strokeColor: '#e6a23c',
      },
      {
        id: 5,
        title: '退换货笔数',
        amount: 352,
        percent: 26,
      },
      {
        id: 6,
        title: '新增收入',
        amount: 159,
        percent: 26,
      },
    ])

    return {
      tilesList
    }
  },
})
</script>

<style lang="less" scoped>
.tiles-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .tile {
    width: 15%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #fff;
    .tile-info {
      display: flex;
      flex-direction: column;
      margin-right: 15px;
    }
    .tile-amount {
      font-size: 28px;
    }
    .tile-title {
      font-size: 12px;
      color: #777;
    }
  }
}

.sale-info {
  width: 32%;
  background: #fff;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: solid 1px #ddd;
    .title {
      font-size: 20px;
      color: #777;
    }
  }
  .chart-box {
    padding: 0 10px;
  }
}
.width-66 {
  width: 66%;
}
</style>