<template>
  <div class="container">
    <div class="btn-box">
      <a-button type="primary" @click="scaleOption('amplify')">放大</a-button>
      <a-button type="primary" @click="scaleOption('reduce')">缩小</a-button>
      <a-button @click="scaleOption('restore')">还原</a-button>
    </div>

    <div ref="chartWrapBoxRef">
      <div ref="chartRef"></div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, onMounted, nextTick } from "vue";
import { Chart } from "@antv/g2";
import dayjs from "dayjs";

export default defineComponent({
  name: "G2Line",
  setup() {
    const getRandom = () => {
      return Math.floor(Math.random() * 100)
    }

    const defaultFormat = 'YYYY-MM-DD hh:mm'
    let charData = [];
    let dateTicks = [];
    let minTime = 0;
    let maxTime = 0;
    let tickCount = 4;

    const setChartData = () => {
      let _arr = [];
      let timestamp = new Date().getTime();

      minTime = timestamp;
      dateTicks.push(minTime)

      for (let i=0; i<10; i++) {
        timestamp += 10 * 60 * 1000;
        dateTicks.push(timestamp);
        // const _date = dayjs(timestamp).format(defaultFormat);
        let beam = getRandom();
        if (i>3 && i<7) {
          beam = undefined
        }
        _arr.push({
          date: timestamp,
          city: '北京',
          temperature: getRandom(),
          humidity: getRandom(),
          beam
        })
      }

      maxTime = _arr[_arr.length - 1].date;
      dateTicks.push(maxTime)

      charData = _arr;
    }
    setChartData();

    const chartRef = ref();
    const newChart = ref();
    const chartWrapBoxRef = ref();

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
        date: {
          range: [0, 1],
          // min: minTime,
          // max: maxTime,
          // ticks: dateTicks
          // ticks: ['2023-06-13 03:30', '2023-06-13 03:40', '2023-06-13 03:50', '2023-06-13 04:00', '2023-06-13 04:30', '2023-06-13 05:30', '2023-06-13 06:30'],
        },
        temperature: {
          type: 'linear',
          nice: true,
          min: 0,
          max: 100,
          // tickCount: 10, // 坐标轴上刻度点的个数
        },
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
        title: (val) => {
          return dayjs(Number(val)).format(defaultFormat);
        },
        formatter: (val) => {
          return dayjs(Number(val)).format(defaultFormat);
        },
      });

      chart.axis('date', {
        label: {
          formatter: (val) => {
            return dayjs(Number(val)).format(defaultFormat);
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
          // formatter: (val) => {
          //   return val + ' °C';
          // },
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

      chart.line().position('date*temperature').size(3).color('#f00');
      chart.point().position('date*temperature').color('city').shape('circle').size(3);

      chart.line().position('date*humidity').size(3).color('#0f0');
      chart.point().position('date*humidity').color('city').shape('circle').size(3);

      chart.line().position('date*beam').size(3).color('#00f');
      chart.point().position('date*beam').color('city').shape('circle').size(3);

      chart.render();
    };

    // 放大缩小相关变量
    const scaleObj = reactive({
      width: 100,
      height: 100,
      scale: 0,
    });
    let initHeight = 500;
    nextTick(() => {
      initHeight = chartWrapBoxRef.value.clientHeight;
    })

    const scaleOption = (type) => {
      const chart = newChart.value;
      scaleObj.width = chartWrapBoxRef.value.clientWidth;

      if (type == "amplify") { // 放大
        minTime = minTime - 10 * 60 * 1000;
        maxTime = maxTime + 10 * 60 * 1000;
        tickCount++;
        scaleObj.scale++;
      } else if (type == "reduce") { // 缩小
        minTime = minTime + 10 * 60 * 1000;
        maxTime = maxTime - 10 * 60 * 1000;
        tickCount--;
        scaleObj.scale--;
      } else if (type == "restore") { // 还原
        minTime = charData[0].date;
        maxTime = charData[charData.length - 1].date;
        scaleObj.scale = 0;
        tickCount = 4;
      }

      if (tickCount <= 2) {
        tickCount = 2;
      }

      scaleObj.height = initHeight + scaleObj.scale * 50;

      chart.scale({
        date: {
          range: [0, 1],
          min: minTime,
          max: maxTime,
          // ticks: dateTicks
          // ticks: ['2023-06-13 03:30', '2023-06-13 03:40', '2023-06-13 03:50', '2023-06-13 04:00', '2023-06-13 04:30', '2023-06-13 05:30', '2023-06-13 06:30'],
        },
        temperature: {
          alias: '温度',
          type: 'linear',
          nice: true,
          min: 0,
          max: 100,
          tickCount: tickCount, // 坐标轴上刻度点的个数
        },
      });
      
      chart.changeSize(scaleObj.width, scaleObj.height);

      console.log("=== minTime, maxTime: ", minTime, maxTime);
      const orgData = JSON.parse(JSON.stringify(charData));
      const needData = orgData.filter(item => {
        return item.date >= minTime && item.date <= maxTime
      });
      chart.changeData(needData);
    }

    onMounted(() => {
      drawChart();
    })

    return {
      chartRef,
      chartWrapBoxRef,
      scaleOption
    };
  },
});
</script>

<style lang="less" scoped>
.btn-box {
  margin: 10px 0;
  .ant-btn {
    margin: 0 6px;
  }
}
</style>
