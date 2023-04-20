<template>
  <div ref="lineChartRef" style="width: 100%; height: 300px"></div>
</template>

<script>
import {
  ref,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  computed,
} from "vue";
import echarts from "@/utils/echarts.js";
import mitt from "@/utils/mitt.js";

export default defineComponent({
  name: "LineChart",
  props: {},
  setup() {
    const lineChartRef = ref();

    const xList = ref(["x轴1", "x轴2", "x轴3", "x轴4", "x轴5", "x轴6", "x轴7"]);
    const yList = ref([820, 932, 901, 934, 1290, 1330, 1320]);

    const setOptions = computed(() => {
      return {
        title: {
          text: '温度监控'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          },
          minorSplitLine: {
            show: true
          }
        },
        series: [
          {
            name: 'Highest',
            type: 'line',
            data: [10, 11, 13, 11, 12, 12, 9],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            },
            smooth: true
          },
          {
            name: 'Lowest',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
            },
            markLine: {
              data: [
                { type: 'average', name: 'Avg' },
                [
                  {
                    symbol: 'none',
                    x: '90%',
                    yAxis: 'max'
                  },
                  {
                    symbol: 'circle',
                    label: {
                      position: 'start',
                      formatter: 'Max'
                    },
                    type: 'max',
                    name: '最高点'
                  }
                ]
              ]
            },
            smooth: true
          }
        ]
      };
    });

    let myChart = null;
    const initChart = () => {
      myChart = echarts.init(lineChartRef.value);
      myChart.setOption(setOptions.value);
      window.onresize = function () {
        //自适应大小
        myChart.resize();
      };
    };

    mitt.on("addLineChartData", (obj) => {
      xList.value.push(obj.xval);
      yList.value.push(obj.yval);
      console.log("=== xList", xList.value);
      console.log("=== yList", yList.value);
      initChart();
    });

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      myChart.dispose(); // 销毁实例
      mitt.off("addLineChartData");
    });

    return {
      lineChartRef
    };
  },
});
</script>
