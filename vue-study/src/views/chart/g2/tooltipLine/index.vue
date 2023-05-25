<template>
  <div class="container">
    <div ref="chartRef"></div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import DataSet from '@antv/data-set';
import { Chart, registerInteraction } from '@antv/g2';

export default defineComponent({
  name: "G2TooltipLine",
  setup() {
    const chartRef = ref();
    fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/sp500.json')
      .then(res => res.json())
      .then(data => {
        console.log("=== data: ", data);

        const chart = new Chart({
          container: chartRef.value,
          autoFit: true,
          height: 500,
          defaultInteractions:[]
        });
        chart.tooltip({
          showCrosshairs: true
        });
        chart.removeInteraction('tooltip');
        chart.scale('date', {
          sync: true,
          tickCount: 5,
          range: [0, 1]
        });
        chart.scale('price', {
          sync: true
        });
        const view1 = chart.createView({
          region: {
            start: {
              x: 0,
              y: 0
            },
            end: {
              x: 1,
              y: 0.5
            }
          },
          padding: [10, 10, 30, 60]
        });
        view1.animate(false);
        view1.data(data);
        view1.interaction('tooltip');
        view1.interaction('sibling-tooltip');
        view1.line().position('date*price').color('#0f0');

        const view2 = chart.createView({
          region: {
            start: {
              x: 0,
              y: 0.5
            },
            end: {
              x: 1,
              y: 1
            }
          },
          padding: [10, 10, 30, 60]
        });
        view2.interaction('tooltip');
        view2.interaction('sibling-tooltip');
        view2.data(data);
        view2.line().position('date*price').color('#66ccff');

        chart.render();
      });

    return {
      chartRef
    };
  },
});
</script>

