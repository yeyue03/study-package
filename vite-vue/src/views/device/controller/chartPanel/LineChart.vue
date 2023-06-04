<template>
  <div class="chart-box" ref="chartRef"></div>
</template>

<script lang="ts">
  import { ref, defineComponent, onMounted, toRefs, watch, inject } from 'vue';
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
      const needPanelRowList = ref(['temperature', 'humidity', 'beam']); // 该设备含有的面板类似 温度、湿度、光照

      const chartRef = ref();
      const newChart = ref();
      const view1 = ref();
      const view2 = ref();

      watch(chartData, (newVal) => {
        console.log(" === newVal: ", pageName.value, newVal);
        drawChart();
      });

      const injectDeviceObj = inject("changeDeviceObj", {});
      watch(injectDeviceObj, (newVal) => {
        let _arr = [];
        if (newVal.isTemperature) {
          _arr.push('temperature');
        }
        if (newVal.isHumidity) {
          _arr.push('humidity');
        }
        if (newVal.isBeam) {
          _arr.push('beam');
        }
        needPanelRowList.value = _arr;
      });

      const drawChart = () => {
        if (newChart.value) {
          // const view1Data = chartData.value.filter((item) => item.type == 'temperature');
          view1.value.data(chartData.value);
          // const view2Data = chartData.value.filter((item) => item.type == 'humidity');
          view2.value.data(chartData.value);
          newChart.value.render();
        } else {
          // const chartHight = document.body.clientHeight - 200; // 暂时替换
          const chartHight = document.body.clientHeight - 100;
          newChart.value =
            newChart.value ||
            new Chart({
              container: chartRef.value,
              autoFit: true,
              height: chartHight,
              defaultInteractions: [],
            });

          const chart = newChart.value;
          // chart.tooltip({
          //   showCrosshairs: true,
          //   shared: true,
          // });
          chart.removeInteraction('tooltip');

          chart.scale('date', {
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
          view1.value.tooltip({
            shared: true,
            showCrosshairs: true,
            containerTpl: `<div class="g2-tooltip"><p class="g2-tooltip-title"></p><ul class="g2-tooltip-list"></ul></div>`,
            itemTpl: `
              <ul class="g2-tooltip-list">
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">温度</span>:<span class="g2-tooltip-value">{temperature}℃</span>
                </li>
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">温度上方差</span>:<span class="g2-tooltip-value">{temperatureMax}℃</span>
                </li>
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">温度下方差</span>:<span class="g2-tooltip-value">{temperatureMin}℃</span>
                </li>
              </ul>
            `,
          })
          view1.value.animate(false);
          view1.value.data(chartData.value);
          view1.value.interaction('tooltip');
          view1.value.interaction('sibling-tooltip');

          if (pageName.value == 'Simulation') { // 预测
            view1.value.line().position('date*temperature').color('#f00').tooltip('date*temperature*temperatureMax*temperatureMin',function(date, temperature, temperatureMax, temperatureMin){
              return {
                date,
                temperature,
                temperatureMax,
                temperatureMin,
              }
            });
            view1.value.line().position('date*temperatureMax').color('#f00').shape('dash').tooltip(false);
            view1.value.line().position('date*temperatureMin').color('#f00').shape('dash').tooltip(false);
          } else { // 实际
            view1.value.line().position('date*value').color('dec');
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

          view2.value.tooltip({
            shared: true,
            showCrosshairs: true,
            containerTpl: `<div class="g2-tooltip"><p class="g2-tooltip-title"></p><ul class="g2-tooltip-list"></ul></div>`,
            itemTpl: `
              <ul class="g2-tooltip-list">
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">湿度</span>:<span class="g2-tooltip-value">{humidity}%rh</span>
                </li>
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">湿度上方差</span>:<span class="g2-tooltip-value">{humidityMax}%rh</span>
                </li>
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">湿度下方差</span>:<span class="g2-tooltip-value">{humidityMin}%rh</span>
                </li>
              </ul>
            `,
          })
          view2.value.interaction('tooltip');
          view2.value.interaction('sibling-tooltip');
          view2.value.data(chartData.value);
          if (pageName.value == 'Simulation') { // 预测
            view2.value.line().position('date*humidity').color('#f00').tooltip('date*humidity*humidityMax*humidityMin',function(date, humidity, humidityMax, humidityMin){
              return {
                date,
                humidity,
                humidityMax,
                humidityMin,
              }
            });
            view2.value.line().position('date*humidityMax').color('#f00').shape('dash').tooltip(false);
            view2.value.line().position('date*humidityMin').color('#f00').shape('dash').tooltip(false);

          } else { // 实际
            view2.value.line().position('date*value').color('dec');
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
