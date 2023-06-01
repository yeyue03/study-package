<template>
  <div class="container">
    <div ref="chartRef"></div>
  </div>
</template>

<script>
import { ref, defineComponent, nextTick } from "vue";
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
    let startDayTimestamp = (new Date(dayjs(nowTimestamp).startOf('day').format(defaultFormat))).getTime();
    const initChart = () => {
      const dateArr = [];
      for (let i=0; startDayTimestamp > nowTimestamp; i++) {
        dateArr.push({
          date: dayjs(startDayTimestamp).format(defaultFormat),
          price: getRandom()
        })
        startDayTimestamp += 60 * 1000 * 5
      }

      const chart = new Chart({
        container: chartRef.value,
        autoFit: true,
        height: 500,
        defaultInteractions: [],
      });
      chart.tooltip({
        showCrosshairs: true,
      });
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

      chart.render();
    };
    nextTick(() => {
      initChart();
    })

    return {
      chartRef,
    };
  },
});
</script>

