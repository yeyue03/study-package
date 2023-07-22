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
    const charData = [];
    for (let i=0; i<100; i++) {
      charData.push({
        month: i * 10,
        temperature: i
      })
    }

    const chartRef = ref();
    const newChart = ref();

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
        // grid: {
        //   line: {
        //     type: 'line',
        //     style: {
        //       stroke: '#aaa',
        //       lineDash: [4, 4]
        //     }
        //   }
        // },
        tickLine: {
          length: 30,
          style: {
            lineWidth: 1,
            textAlign: 'left',
            fontSize: 20,
            fontStyle: 'italic'
          }
        },
        // subTickLine: {
        //   length: 10,
        //   // count: 10
        // },
      });

      chart.axis('temperature', {
        title: {
          text: '温度监控表',
          style: {
            fontSize: 15
          }
        },
        label: {
          style: {
            lineWidth: 3,
          },
          rotate: 0.5,
          autoHide: false,
          // autoEllipsis: false,
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

      function getTicks(scale) {
        const { min, max, tickCount } = scale;
        console.log("======== scale: ", scale);
        const avg = (max - min) / 20;
        const ticks = [];
        for (let i = min; i <= max; i += avg) {
          ticks.push(i);
        }
        return ticks;
      }

      chart.scale('month', {
        type: 'linear',
        // tickCount: 10,
        tickMethod: getTicks
        // tickInterval: 10,
        // minTickInterval: 500,
        // maxTickCount: 2
      })

      chart.scale('temperature', {
        min: 0,
        max: 100,
        tickInterval: 3,
      })

      chart
        .line()
        .position('month*temperature')
        .shape('smooth')
        .size(3);

      chart
        .point()
        .position('month*temperature')
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

