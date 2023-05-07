<template>
  <a-row justify="end">
    <a-button size="small" @click="kzoom('l')">拉长</a-button>
    <a-button size="small" @click="kzoom('s')" style="margin-left: 8px;">缩短</a-button>
  </a-row>
  <div ref="chartRef"></div>
</template>

<script>
import { ref, defineComponent, onMounted, toRefs, watch, computed } from "vue";
import { Chart } from "@antv/g2";

export default defineComponent({
  name: "LineChart",
  props: {
    chartData: {
      type: Object,
      default: () => {
        return []
      }
    },
    chartConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props) {
    const { chartData, chartConfig } = toRefs(props);
    const chartRef = ref();
    const newChart = ref();
    const maxNum = ref(120);

    watch(chartData, () => {
      drawChart();
      maxNum.value = chartConfig.value?.max;
    })

    // 把分钟数转化为 hh:mm
    const getDateStr = value => {
      value = parseInt(value);
      let hour = Math.floor(value / 60);
      let minute = value % 60;

      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      return hour + ':' + minute;
    }

    const drawChart = (xMax) => {
      newChart.value = newChart.value || new Chart({
        container: chartRef.value,
        width: '100%',
        autoFit: true,
        height: 350,
      });

      const chart = newChart.value;
      chart.data(chartData.value || []);

      const config = chartConfig.value || {};

      chart.scale({
        time: {
          nice: true,
          min: 0, // 起始
          max: xMax || config.max || 120,
        },
        value: {
          min: 0,
          nice: true,
        },
      });

      chart.tooltip({
         title: title => getDateStr(title),
        showCrosshairs: true,
        shared: true,
      });
      chart.legend(false);

      chart.axis('time', {
        title: {
          text: config.xtitle || '',
          style: {
            fontSize: 15
          }
        },
        // line: {
        //   style: {
        //     stroke: '#fff',
        //   }
        // },
        // tickLine: {
        //   style: {
        //     stroke: '#fff',
        //   }
        // },
        label: {
          formatter: value => getDateStr(value),
          // style: {
          //   stroke: '#777',
          //   fontStyle: 'normal',
          //   fontFamily: '宋体'
          // }
        },
        grid: {
          line: {
            type: 'line',
            style: {
              stroke: '#aaa',
              lineDash: [4, 4]
            }
          }
        },
      });

      chart.axis('value', {
        title: {
          text: config.ytitle || '',
          style: {
            fontSize: 15
          }
        },
        label: {
          formatter: (val) => {
            return val + ' °C';
          },
        },
        grid: {
          line: {
            type: 'line',
            style: {
              stroke: '#aaa',
              lineDash: [4, 4]
            },
          }
        },
      });

      chart
        .line()
        .position('time*value')
        .color('type')
        .shape('smooth')
        .size(3);

      chart
        .point()
        .position('time*value')
        .color('type')
        .shape('circle')
        .size(5);

      chart.render();
    };

    onMounted(() => {
      // const init = document.createEvent('Event')
      // init.initEvent('resize', true, true);
      // window.dispatchEvent(init);
      // setTimeout(() => {
      //   drawChart();
      // }, 20);

      drawChart();
    })

    const kzoom = type => {
      if (type == 'l') {
        maxNum.value += 30;

      } else if (type == 's' && maxNum.value > 60) {
        maxNum.value -= 30;
      }

      const chart = newChart.value;
      chart.scale({
        time: {
          nice: true,
          min: 0, // 起始
          max: maxNum.value,
        },
        value: {
          min: 0,
          nice: true,
        },
      });

      chart.render();
    }

    return {
      chartRef,
      kzoom
    };
  },
});
</script>

