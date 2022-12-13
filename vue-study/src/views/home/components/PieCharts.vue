<template>
  <div :id="echartId"></div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, toRefs } from "vue";
import echarts from "@/utils/echarts.js";

export default defineComponent({
  name: "StackedAreaChart",
  props: {
    echartId: {
      type: String,
      defalut: () => {
        return ''
      }
    }
  },
  setup(props) {
    const { echartId } = toRefs(props);
    const setOptions = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
      },
      series: [
        {
          name: '人数',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: '销售部' },
            { value: 735, name: '技术部' },
            { value: 580, name: '研发部' },
            { value: 484, name: '售后部' },
            { value: 300, name: '人事部' }
          ]
        }
      ]
    };

    let myChart = null;
    const initChart = () => {
      myChart = echarts.init(document.getElementById(echartId.value));
      myChart.setOption(setOptions);
      window.onresize = function () {
        //自适应大小
        myChart.resize();
      };
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      myChart.dispose(); // 销毁实例
    })

    return {};
  },
});
</script>

<style scoped>
#main {
  width: 100%;
  height: 100%;
}
</style>