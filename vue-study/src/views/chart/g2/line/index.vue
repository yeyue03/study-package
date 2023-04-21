<template>
  <div class="container">
    <div ref="chartRef"></div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { Chart } from "@antv/g2";

export default defineComponent({
  name: "G2Line",
  setup() {
    const charData = [
      { month: 'Jan', city: 'Tokyo', temperature: 7 },
      { month: 'Jan', city: 'London', temperature: 3.9 },
      { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
      { month: 'Feb', city: 'London', temperature: 4.2 },
      { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
      { month: 'Mar', city: 'London', temperature: 5.7 },
      { month: 'Apr', city: 'Tokyo', temperature: 14.5 },
      { month: 'Apr', city: 'London', temperature: 8.5 },
      { month: 'May', city: 'Tokyo', temperature: 18.4 },
      { month: 'May', city: 'London', temperature: 11.9 },
    ];

    const charData02 = [
      { month: 'Jan', city: 'Tokyo', temperature: 10 },
      { month: 'Jan', city: 'London', temperature: 5 },
      { month: 'Jun', city: 'Tokyo', temperature: 21.5 },
      { month: 'Jun', city: 'London', temperature: 15.2 },
      { month: 'Jul', city: 'Tokyo', temperature: 25.2 },
      { month: 'Jul', city: 'London', temperature: 17 },
      { month: 'Aug', city: 'Tokyo', temperature: 26.5 },
      { month: 'Aug', city: 'London', temperature: 16.6 },
      { month: 'Sep', city: 'Tokyo', temperature: 23.3 },
      { month: 'Sep', city: 'London', temperature: 14.2 },
      { month: 'Oct', city: 'Tokyo', temperature: 18.3 },
      { month: 'Oct', city: 'London', temperature: 10.3 },
      { month: 'Nov', city: 'Tokyo', temperature: 13.9 },
      { month: 'Nov', city: 'London', temperature: 6.6 },
      { month: 'Dec', city: 'Tokyo', temperature: 9.6 },
      { month: 'Dec', city: 'London', temperature: 4.8 },
    ]

    const chartRef = ref();
    const newChart = ref();

    setTimeout(() => {
      console.log("=== 第二次赋值");
      newChart.value.data(charData02);
      newChart.value.render();
      // drawChart(charData02);
    }, 6000);

    const drawChart = (dataArr) => {
      dataArr = dataArr || charData;
      if (!newChart.value) {
        newChart.value = new Chart({
          container: chartRef.value,
          // width: 800,
          autoFit: true,
          height: 500,
        });
      }

      const chart = newChart.value;
      chart.data(dataArr);

      chart.scale({
        month: {
          range: [0, 1],
        },
        temperature: {
          nice: true,
        },
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      chart.axis('month', {
        label: {
          formatter: (val) => {
            return val + ' 月';
          },
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

      chart.axis('temperature', {
        title: {
          text: '温度监控表',
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
            }
          }
        },
      });

      chart
        .line()
        .position('month*temperature')
        .color('city')
        .shape('smooth')
        .size(3);

      chart
        .point()
        .position('month*temperature')
        .color('city')
        .shape('circle')
        .size(5);

      chart.render();
    };


    onMounted(() => {
      drawChart();
    })

    return {
      chartRef
    };
  },
});
</script>

