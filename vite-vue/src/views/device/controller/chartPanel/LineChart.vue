<template>
  <div class="chart-box" ref="chartRef"></div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent, onMounted, toRefs, watch, inject } from 'vue';
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
      const needPanelRowList = inject("changePanelRowList", ['temperature', 'humidity', 'beam']); // 该设备含有的面板类似 温度、湿度、光照

      const chartRef = ref();
      const newChart = ref(); // 图标
      const viewObj = reactive({}); // 子表

      watch(chartData, (newVal) => {
        console.log(" === 折线图数据: ", pageName.value, newVal);
        drawChart();
      });

      const injectDeviceObj = inject('changeDeviceObj', {});
      const oldDeviceId = ref();
      // 设备变更后，销毁chart 实例，需要时重新创建，防止子表数量与温度、湿度、光照数量不匹配
      watch(injectDeviceObj, () => {
        if (newChart.value) {
          newChart.value.clear();
          newChart.value.destroy();
          newChart.value = null;
          console.log("=== 销毁后重新创建");
          drawChart();
        }
      })

      const drawChart = () => {
        console.log("===== newChart.value: ", newChart.value);
        
        if (newChart.value) {
          setViewChartData();
          newChart.value.render();

        } else {
          console.log("=== 创建 chart");
          
          // let chartHight = document.body.clientHeight - 200; // 暂时替换
          let chartHight = document.body.clientHeight - 106;
          if (pageName.value == 'Protocol') {
            chartHight -= 35 // 减去搜索框高度
          }
          newChart.value = new Chart({
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

          setViewOption(chart);
          chart.render();
        }
      };

      const addYObj = {
        1: 1,
        2: 0.5,
        3: 0.33,
      }
      const panelTypeStrObj = {
        temperature: '温度',
        humidity: '湿度',
        beam: '光照',
      }
      const panelTypeSymboObj = {
        temperature: '℃',
        humidity: '%rh',
        beam: 'lx',
      }

      // 图标数据赋值
      const setViewChartData = () => {
        for (const panelType of needPanelRowList.value) {
          const _arr = chartData.value.filter((item) => item.panelType == panelType);
          viewObj[panelType].data(_arr);
        }
      }

      // 图标配置
      const setViewOption = (chart) => {
        const viewLen = needPanelRowList.value.length;
        let endY = addYObj[viewLen];

        let _index = 1;
        for (const panelType of needPanelRowList.value) {
          viewObj[panelType] = chart.createView({
            region: {
              start: {
                x: 0,
                y: endY * (_index - 1),
              },
              end: {
                x: 1,
                y: _index == 3 ? 1 : (endY * _index),
              },
            },
            padding: [10, 60, 30, 60]
          });

          _index++;

          viewObj[panelType].tooltip({
            shared: true,
            showCrosshairs: true,
            containerTpl: `<div class="g2-tooltip"><p class="g2-tooltip-title"></p><ul class="g2-tooltip-list"></ul></div>`,
            itemTpl: `
              <ul class="g2-tooltip-list">
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">${ panelTypeStrObj[panelType] }</span>:<span class="g2-tooltip-value">{value} ${ panelTypeSymboObj[panelType] }</span>
                </li>
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">${ panelTypeStrObj[panelType] }</span>:<span class="g2-tooltip-value">{bandMax} ${ panelTypeSymboObj[panelType] }</span>
                </li>
                <li class="g2-tooltip-list-item">
                  <span class="g2-tooltip-marker" style="background-color: {color};"></span>
                  <span class="g2-tooltip-name">${ panelTypeStrObj[panelType] }</span>:<span class="g2-tooltip-value">{bandMin} ${ panelTypeSymboObj[panelType] }</span>
                </li>
              </ul>
            `,
          })
          viewObj[panelType].animate(false);
          // viewObj[panelType].data(chartData.value);
          viewObj[panelType].interaction('tooltip');
          viewObj[panelType].interaction('sibling-tooltip');

          if (pageName.value == 'Simulation') { // 预测
            viewObj[panelType].line().position('date*value').shape('smooth').color('#f00').tooltip('date*value*bandMax*bandMin',function(date, value, bandMax, bandMin){
              return {
                date,
                value,
                bandMax,
                bandMin,
              }
            });
            viewObj[panelType].line().position('date*bandMax').shape('smooth').color('#f00').tooltip(false).style({
              lineDash: [8, 8]
            });
            viewObj[panelType].line().position('date*bandMin').shape('smooth').color('#f00').tooltip(false).style({
              lineDash: [8, 8]
            });

          } else { // 实际
            viewObj[panelType].line().position('date*value').shape('smooth').color('#f00');
          }
          
          viewObj[panelType].axis('value', {
            title: {
              text: `${panelTypeStrObj[panelType]} (${panelTypeSymboObj[panelType]})`,
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

          viewObj[panelType].axis('bandMax', false);
          viewObj[panelType].axis('bandMin', false);
        }

        setViewChartData();
      }

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
