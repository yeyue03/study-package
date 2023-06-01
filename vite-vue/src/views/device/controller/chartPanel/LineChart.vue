<template>
  <div class="chart-box" ref="chartRef"></div>
</template>

<script lang="ts">
  import { ref, defineComponent, onMounted, toRefs, watch } from 'vue';
  import { Chart } from '@antv/g2';

  export default defineComponent({
    name: 'LineChart',
    props: {
      chartData: {
        type: Object,
        default: () => {
          return [];
        },
      },
      pageName: {
        type: String,
        default: () => {
          return '';
        },
      },
    },
    setup(props) {
      const { chartData, pageName } = toRefs(props);

      const chartRef = ref();
      const newChart = ref();
      const view1 = ref();
      const view2 = ref();

      watch(chartData, (newVal) => {
        drawChart();
      });

      // 把分钟数转化为 hh:mm
      // const getDateStr = (value: string | number) => {
      //   value = parseInt(value);
      //   let hour: string | number = Math.floor(value / 60);
      //   let minute: string | number = value % 60;

      //   hour = hour < 10 ? '0' + hour : hour;
      //   minute = minute < 10 ? '0' + minute : minute;
      //   return hour + ':' + minute;
      // }

      const drawChart = () => {
        if (newChart.value) {
          const view1Data = chartData.value.filter((item) => item.type == 'temperature');
          view1.value.data(view1Data);
          const view2Data = chartData.value.filter((item) => item.type == 'humidity');
          view2.value.data(view2Data);
          newChart.value.render();
        } else {
          const chartHight = document.body.clientHeight - 200;
          newChart.value =
            newChart.value ||
            new Chart({
              container: chartRef.value,
              autoFit: true,
              height: chartHight,
              defaultInteractions: [],
            });

          const chart = newChart.value;
          chart.tooltip({
            showCrosshairs: true,
            shared: true,
          });
          chart.removeInteraction('tooltip');

          chart.scale('time', {
            sync: true,
            range: [0, 1],
          });
          chart.scale('value', {
            sync: true,
          });

          view1.value = chart.createView({
            region: {
              start: {
                x: 0,
                y: 0,
              },
              end: {
                x: 1,
                y: 0.5,
              },
            },
            padding: [10, 60, 30, 60],
          });
          const view1Data = chartData.value.filter((item) => item.type == 'temperature');
          view1.value.animate(false);
          view1.value.data(view1Data);
          view1.value.interaction('tooltip');
          view1.value.interaction('sibling-tooltip');
          if (pageName.value == 'Simulation') {
            view1.value.line().position('time*value').color('#0f0').shape('smooth');
          } else {
            view1.value.line().position('time*value').color('dec').shape('smooth');
          }
          view1.value.axis('value', {
            title: {
              text: 'temperature (℃)',
              style: {
                fontSize: 15,
              },
            },
            grid: {
              line: {
                type: 'line',
                style: {
                  stroke: '#aaa',
                  lineDash: [4, 4],
                },
              },
            },
          });

          view2.value = chart.createView({
            region: {
              start: {
                x: 0,
                y: 0.5,
              },
              end: {
                x: 1,
                y: 1,
              },
            },
            padding: [10, 60, 30, 60],
          });
          const view2Data = chartData.value.filter((item) => item.type == 'humidity');

          view2.value.interaction('tooltip');
          view2.value.interaction('sibling-tooltip');
          view2.value.data(view2Data);
          if (pageName.value == 'Simulation') {
            view2.value.line().position('time*value').color('#66ccff').shape('smooth');
          } else {
            view2.value.line().position('time*value').color('dec').shape('smooth');
          }

          view2.value.axis('value', {
            title: {
              text: '%rH',
              style: {
                fontSize: 15,
              },
            },
            grid: {
              line: {
                type: 'line',
                style: {
                  stroke: '#aaa',
                  lineDash: [4, 4],
                },
              },
            },
          });

          chart.render();
        }
      };

      onMounted(() => {
        drawChart();
      });

      return {
        chartRef,
      };
    },
  });
</script>

<style scoped>
  .chart-box {
    width: 100%;
  }
</style>
