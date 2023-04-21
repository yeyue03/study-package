<template>
  <div class="container">
    <div class="chart" ref="lineChartRef"></div>
  </div>
</template>

<script>
import {
  ref,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  computed,
  toRefs,
  watch,
  markRaw
} from "vue";
import echarts from "@/utils/echarts.js";

export default defineComponent({
  name: "EchartsLine",
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props) {
    const { dataSource } = toRefs(props);
    const lineChartRef = ref();

    const setOptions = computed(() => {
      return {
        title: {
          text: ''
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        legend: {
          textStyle: {
            fontSize: 12,
            color: '#333'
          }
        },
        grid: {  
          left: 50,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          interval: 30, // 步长
          min: 0, // 起始
          max: function (value) {
            let minute = value.max % 60;
            minute = Math.abs(30 - minute);
            return value.max + minute;
          },
          axisLabel: {
            formatter: (value) => {
              value = parseInt(value);
              let hour = Math.floor(value / 60);
              let minute = value % 60;

              hour = hour < 10 ? '0' + hour : hour;
              minute = minute < 10 ? '0' + minute : minute;
              return hour + ':' + minute;
            }
          },
          axisLine: {
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '温度监控统计图',
          nameLocation: 'center',
          // nameRotate: 90,
          nameTextStyle:{
            color:'#333',
            fontSize: 14,
            padding: [0, 0, 40, 0]
          },
          axisLabel: {
            formatter: '{value} °C'
          },
          // minorSplitLine: {
          //   show: true
          // }
          axisLine: {
            lineStyle: {
              color: '#333',
            },
            symbolSize: 5,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 5
            },
            symbolSize: 10
          },
          {
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 5
            },
            symbolSize: 10
          },
        ],
        dataset: {
          // dimensions: ['product', '预设', '实际'],
          // source: [
          //   { 'product': 70, '预设': 10, '实际': 12 },
          //   { 'product': 150, '预设': 12, '实际': 15 },
          //   { 'product': 200, '预设': 15, '实际': 18 },
          //   { 'product': 280, '预设': 17, '实际': 20 },
          //   { 'product': 350, '预设': 20, '实际': 22 },
          // ]

          source: [
            ['product', '预设', '实际'],
            [70, 10, 15],
            [150, 13, 14],
            [200, 20, 18],
            [250, 25, 28],
            [320, 20, 22],
          ]

          // source: dataSource.value
        }
      };
    });

    watch(setOptions, () => {
      initChart();
    })

    const myChart = ref();
    const initChart = () => {
      if (!myChart.value) {
        myChart.value = markRaw(echarts.init(lineChartRef.value));
      }
      myChart.value.setOption(setOptions.value);
      myChart.value.resize();
      // 自适应大小
      // window.onresize = function () {
      //   myChart.value.resize();
      // };
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      myChart.value.dispose(); // 销毁实例
    });

    return {
      lineChartRef
    };
  },
});
</script>

<style lang="less" scoped>
.chart {
  // width: 100%;
  // width: 500px;
  height: 400px
}
</style>
