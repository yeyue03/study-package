<template>
  <div :id="echartId"></div>
</template>

<script>
import {
  ref,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  toRefs,
  computed,
} from "vue";
import echarts from "@/utils/echarts.js";
import mitt from "@/utils/mitt.js";

export default defineComponent({
  name: "LineChart",
  props: {
    echartId: {
      type: String,
      defalut: () => {
        return "";
      },
    },
  },
  setup(props) {
    const { echartId } = toRefs(props);
    const xList = ref(["x轴1", "x轴2", "x轴3", "x轴4", "x轴5", "x轴6", "x轴7"]);
    const yList = ref([820, 932, 901, 934, 1290, 1330, 1320]);

    const setOptions = computed(() => {
      return {
        xAxis: {
          type: "category",
          data: xList.value,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: yList.value,
            type: "line",
            smooth: true,
          },
        ],
      };
    });

    let myChart = null;
    const initChart = () => {
      myChart = echarts.init(document.getElementById(echartId.value));
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

    return {};
  },
});
</script>
