<template>
  <div class="container">
    <div ref="chartRef"></div>
  </div>
</template>

<script>
import { ref, defineComponent, nextTick, onMounted } from "vue";
import { Chart } from "@antv/g2";
import dayjs from "dayjs";

export default defineComponent({
  name: "G2TooltipLine",
  setup() {
    const chartRef = ref();

    const getRandom = () => {
      return Math.floor(Math.random() * 1000)
    }

    const defaultFormat = 'hh:mm:ss'
    const nowTimestamp = (new Date()).getTime();
    let startDayTimestamp = nowTimestamp - 3 * 60 * 60 * 1000
    const initChart = () => {
      const dateArr = [];
      for (let i=0; startDayTimestamp < nowTimestamp; i++) {
        dateArr.push({
          date: dayjs(startDayTimestamp).format(defaultFormat),
          price: getRandom(),
          realPrice: getRandom(),
          temperature: getRandom(),
          realTemperature: getRandom()
        })
        startDayTimestamp += 60 * 1000 * 5
      }

      console.log("==== dateArr: ", dateArr);
      const chart = new Chart({
        container: chartRef.value,
        autoFit: true,
        height: 500,
        defaultInteractions: [],
      });
      // chart.tooltip({
      //   title: '测试',
      //   showCrosshairs: true,
      // });

      chart.tooltip({
        shared: true,
        showCrosshairs: true,
        title: '测试',
      })

      chart.removeInteraction("tooltip");
      chart.scale("date", {
        sync: true,
        tickCount: 5,
        range: [0, 1],
      });
      chart.scale("price", {
        sync: true,
      });
      const view1 = chart.createView({
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
        padding: [10, 10, 30, 60],
      });
      view1.animate(false);
      view1.data(dateArr);
      view1.interaction("tooltip");
      view1.interaction("sibling-tooltip");
      view1.line().position("date*price").color("#0f0");
      view1.line().position("date*realPrice").color("#0ff");
      view1.line().position("date*temperature").shape(['smooth', 'dash']).color("#f00");

      view1.axis('price', {
        grid: {
          line: {
            type: 'line',
            style: {
              stroke: '#aaa',
              lineDash: [4, 4],
            },
          },
        },
      })
      view1.axis('realPrice', false);
      view1.axis('temperature', false);
      view1.scale('price', {
        alias: '表1',
        min: 0,
        max: 1000,
        minLimit: 0,
        maxLimit: 1000,
      });

      const view2 = chart.createView({
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
        padding: [10, 10, 30, 60],
      });
      view2.interaction("tooltip");
      view2.interaction("sibling-tooltip");
      view2.data(dateArr);
      view2.line().position("date*price").color("#66ccff");

      view2.axis('price', {
        grid: {
          line: {
            type: 'line',
            style: {
              stroke: '#aaa',
              lineDash: [4, 4],
            },
          },
        },
      })

      chart.render();
    };
    
    onMounted(() => {
      initChart();
    })

    return {
      chartRef,
    };
  },
});
</script>

