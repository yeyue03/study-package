<template>
  <div class="chart-box" ref="chartRef"></div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent,
  onMounted,
  toRefs,
  watch,
  inject,
} from "vue";
import { Chart } from "@antv/g2";
import { LineChartDataObj } from "../types";

export default defineComponent({
  name: "LineChart",
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
        return "";
      },
    },
  },
  setup(props) {
    const { chartData, pageName } = toRefs(props);
    const needPanelRowList: any = inject("changePanelRowList", ["temperature", "humidity", "beam"]); // 该设备含有的面板类似 温度、湿度、光照

    const chartRef = ref();
    const newChart = ref(); // 图标
    const viewObj: any = reactive({}); // 子表对象集

    watch(chartData, (newVal) => {
      console.log(" === 折线图数据: ", pageName.value, newVal);
      drawChart();
    });

    const injectDeviceObj = inject("changeDeviceObj", {});
    // 设备变更后，销毁chart 实例，需要时重新创建，防止子表数量与温度、湿度、光照数量不匹配
    watch(injectDeviceObj, () => {
      if (newChart.value) {
        newChart.value.clear();
        newChart.value.destroy();
        newChart.value = null;
        drawChart();
      }
    });

    const drawChart = () => {
      if (newChart.value) {
        setViewChartData();
        newChart.value.render();
      } else {
        // let chartHight = document.body.clientHeight - 200; // 暂时替换
        let chartHight = document.body.clientHeight - 106;
        if (pageName.value == "Protocol") {
          chartHight -= 40; // 减去搜索框高度
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
        chart.removeInteraction("tooltip");

        chart.scale("date", {
          sync: true,
          range: [0, 1],
        });
        chart.scale("value", {
          sync: true,
        });

        setViewOption(chart);
        chart.render();
      }
    };

    const addYValList: number[] = [1, 0.5, 0.33] // chart多表时y轴结束范围
    const panelTypeStrObj: any = {
      temperature: "温度",
      humidity: "湿度",
      beam: "光照",
    };
    const panelTypeSymboObj: any = {
      temperature: "℃",
      humidity: "%rh",
      beam: "lx",
    };

    // 图标数据赋值
    const setViewChartData = () => {
      for (const panelType of needPanelRowList.value) {
        const _arr = chartData.value.filter((item: LineChartDataObj) => item.panelType == panelType);
        viewObj[panelType].data(_arr);
      }
    };

    // 图标配置
    const setViewOption = (chart: any) => {
      const viewLen = needPanelRowList.value.length;
      let endY = addYValList[viewLen - 1];

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
              y: _index == 3 ? 1 : endY * _index,
            },
          },
          padding: [10, 60, 30, 60],
        });

        _index++;

        // 设置提示框
        viewObj[panelType].tooltip({
          shared: true,
          showCrosshairs: true,
        });
        viewObj[panelType].animate(false);
        viewObj[panelType].interaction("tooltip");
        viewObj[panelType].interaction("sibling-tooltip");

        viewObj[panelType]
          .line()
          .position("date*value")
          .shape("line")
          .size(3)
          .color("#0f0")
          .tooltip("date*value", (_: string, value: number) => {
            return {
              name: '预测' + panelTypeStrObj[panelType],
              value: value + ' ' + panelTypeSymboObj[panelType],
            };
          });

        if (pageName.value == "Protocol") {
          // 实际
          viewObj[panelType]
            .line()
            .position("date*realValue")
            .shape("line")
            .size(3)
            .color("#f00")
            .tooltip("date*realValue", (_: string, value: number) => {
              return {
                name: '实际' + panelTypeStrObj[panelType],
                value: value + ' ' + panelTypeSymboObj[panelType],
              };
            });
        }

        viewObj[panelType]
          .line()
          .position("date*bandMax")
          .shape("line")
          .size(3)
          .color("#f00")
          .style({
            lineDash: [8, 8],
          })
          .tooltip("date*bandMax", (_: string, value: number) => {
            return {
              name: panelTypeStrObj[panelType] + '上方差',
              value: value + ' ' + panelTypeSymboObj[panelType],
            };
          });

        viewObj[panelType]
          .line()
          .position("date*bandMin")
          .shape("line")
          .size(3)
          .color("#f00")
          .style({
            lineDash: [8, 8],
          })
          .tooltip("date*bandMin", (_: string, value: number) => {
            return {
              name: panelTypeStrObj[panelType] + '下方差',
              value: value + ' ' + panelTypeSymboObj[panelType],
            };
          });

        viewObj[panelType].axis("value", {
          title: {
            text: `${panelTypeStrObj[panelType]} (${panelTypeSymboObj[panelType]})`,
            style: {
              fontSize: 15,
            },
          },
          grid: {
            line: {
              type: "line",
              style: {
                stroke: "#aaa",
                lineDash: [4, 4],
              },
            },
          },
        });

        viewObj[panelType].axis("bandMax", false);
        viewObj[panelType].axis("bandMin", false);
        viewObj[panelType].axis("realValue", false);
      }

      setViewChartData();
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
