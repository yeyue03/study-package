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
import dayjs from "dayjs";

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
    const defaultFormat: string = 'YYYY-MM-DD HH:mm';
    const needPanelRowList: any = inject("changePanelRowList", ["temperature", "humidity", "beam"]); // 该设备含有的面板类似 温度、湿度、光照

    const chartRef = ref();
    const newChart = ref(); // 图标
    const viewObj: any = reactive({}); // 子表对象集

    watch(chartData, () => {
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
        let chartHight = document.body.clientHeight - 200; // 计算chart图高度
        if (pageName.value == "Protocol") {
          chartHight -= 60; // 减去搜索框高度
        }
        chartHight = chartHight < 300 ? 300 : chartHight;
        
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

        chart.axis("timestamp", {
          label: {
            formatter: (val: string) => {
              return dayjs(Number(val)).format(defaultFormat);
            },
          },
        });

        chart.scale("timestamp", {
          sync: true,
          range: [0, 1],
        });
        chart.scale("value", {
          sync: true,
          min: 0,
          max: 100
        });
        chart.scale("setVal", {
          sync: true,
          min: 0,
          max: 100
        });
        chart.scale("bandMax", {
          sync: true,
          min: 0,
          max: 100
        });
        chart.scale("bandMin", {
          sync: true,
          min: 0,
          max: 100
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
        viewObj[panelType].changeData(_arr);
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
          limitInPlot: true, // 是否对超出坐标系范围的 Geometry 进行剪切
        });

        _index++;

        // 设置提示框
        viewObj[panelType].tooltip({
          shared: true,
          showCrosshairs: true,
          title: (val: string) => {
            return dayjs(Number(val)).format(defaultFormat);
          },
          itemTpl: `<li class="g2-tooltip-list-item">
            <span class="g2-tooltip-marker" style="background-color: {color};"></span>
            <span class="g2-tooltip-name">{name}</span>:<span class="g2-tooltip-value">{value} ${panelTypeSymboObj[panelType]}</span>
          </li>`
        });
        viewObj[panelType].animate(false);
        viewObj[panelType].interaction("tooltip");
        viewObj[panelType].interaction("sibling-tooltip");

        const valueColor: string = pageName.value == "Protocol" ? '#f00' : '#0f0';
        viewObj[panelType]
          .line()
          .position("timestamp*value")
          .shape("line")
          .size(1)
          .color(valueColor)

        if (pageName.value == "Protocol") { // 实际
          viewObj[panelType]
            .line()
            .position("timestamp*setVal")
            .shape("line")
            .size(1)
            .color("#0f0")
        }

        viewObj[panelType]
          .line()
          .position("timestamp*bandMax")
          .shape("line")
          .size(1)
          .color("#f00")
          .style({
            lineDash: [8, 8],
          })

        viewObj[panelType]
          .line()
          .position("timestamp*bandMin")
          .shape("line")
          .size(1)
          .color("#f00")
          .style({
            lineDash: [8, 8],
          })

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

        const valueAlias: string = pageName.value == "Protocol" ? '实际' : '预测';
        viewObj[panelType].scale("value", {
          alias: valueAlias + panelTypeStrObj[panelType]
        });
        viewObj[panelType].scale("setVal", {
          alias: '设定' + panelTypeStrObj[panelType]
        });
        viewObj[panelType].scale("bandMax", {
          alias: panelTypeStrObj[panelType] + '上方差'
        });
        viewObj[panelType].scale("bandMin", {
          alias: panelTypeStrObj[panelType] + '下方差'
        });

        viewObj[panelType].axis("setVal", false);
        viewObj[panelType].axis("bandMax", false);
        viewObj[panelType].axis("bandMin", false);
      }

      setViewChartData();
    };

    // 放大、缩小改变chart的操作
    const changeChartSize = (_obj: any) => {
      const chart = newChart.value;

      if (_obj.minTimestamp < _obj.maxTimestamp) {
        chart.scale("timestamp", {
          sync: true,
          range: [0, 1],
          min: _obj.minTimestamp,
          max: _obj.maxTimestamp,
          minLimit: _obj.minTimestamp,
          maxLimit: _obj.maxTimestamp,
          tickCount: 15
        });
      }
      
      chart.scale("value", {
        sync: true,
        min: 0,
        max: 100,
        tickCount: _obj.tickCount, // 坐标轴上刻度点的个数
      });
      
      chart.changeSize(_obj.width, _obj.height);
    }

    onMounted(() => {
      drawChart();
    });

    return {
      chartRef,
      changeChartSize
    };
  },
});
</script>

<style scoped>
.chart-box {
  width: 100%;
}
</style>
