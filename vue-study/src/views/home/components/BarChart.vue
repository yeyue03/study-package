<template>
  <div :id="echartId"></div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, toRefs } from "vue";
import echarts from "@/utils/echarts.js";

export default defineComponent({
  name: "StackedAreaChart",
  props: {
    echartId: {
      type: String,
      defalut: () => {
        return ''
      }
    }
  },
  setup(props) {
    const { echartId } = toRefs(props);
    const setOptions = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [
            120,
            {
              value: 200,
              itemStyle: {
                color: '#a90000'
              }
            },
            150,
            80,
            70,
            110,
            130
          ],
          type: 'bar'
        }
      ]
    };

    let myChart = null;
    const initChart = () => {
      myChart = echarts.init(document.getElementById(echartId.value));
      myChart.setOption(setOptions);
      window.onresize = function () {
        //自适应大小
        myChart.resize();
      };
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      myChart.dispose(); // 销毁实例
    })

    return {};
  },
});
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
}
</style>