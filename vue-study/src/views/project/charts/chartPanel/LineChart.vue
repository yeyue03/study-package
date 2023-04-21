<template>
  <div ref="chartRef"></div>
</template>

<script>
import { ref, defineComponent, onMounted, toRefs, watch } from "vue";
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

    watch(chartData, () => {
      drawChart();
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

    const drawChart = () => {
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
          max: config.max || 120,
        },
        value: {
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

    return {
      chartRef
    };
  },
});
</script>

