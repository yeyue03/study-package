<template>
  <div id="linkageLine"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as echarts from "echarts";
import dayjs from 'dayjs';

export default defineComponent({
  name: "LinkageLine",
  setup() {
    let option: any;
    let timeData: any = [];
    let temperatureData: any = [];
    let humidityData: any = [];
    const defaultFormat = 'YYYY-MM-DD HH:mm';

    const getRandom = () => {
      const num: number = Math.random() * 100
      return parseInt(num.toFixed(1));
    }
    
    const initData = () => {
      const timestamp = (new Date("2023-07-01")).getTime();
      let TList = [];
      let HList = [];
      let timeList = [];

      for (let i=0; i<30; i++) {
        TList.push(getRandom());
        HList.push(getRandom());
        timeList.push(timestamp + i * 60 * 1000 * 60);
      }

      temperatureData = TList;
      humidityData = HList;
      timeData = timeList;
    }
    initData();

    option = {
      title: {
        text: "标题",
        left: "center",
      },
      // tooltip: {
      //   trigger: "axis",
      //   axisPointer: {
      //     animation: false,
      //   },
      //   // valueFormatter: (value: any) => '$' + value.toFixed(2)
      // },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          var htmlStr = '';
          for(var i=0;i<params.length;i++){
            var param = params[i];
            var xName = param.name;//x轴的名称
            var seriesName = param.seriesName;//图例名称
            var value = param.value;//y轴值
            var color = param.color;//图例颜色
            
            if(i===0){
              console.log("==== param: ", param);
              
              htmlStr += xName + '<br/>';//x轴的名称
            }
            htmlStr +='<div>';
            
            // 具体显示的数据【字段名称：seriesName，值：value】
            // 这里判断一下name，如果是我们需要特殊处理的，就处理
            // if(seriesName === 'Temperature'){
            //     // 前面一条线，后面一条线【具体样式自己写】
            //     htmlStr += '<div style="border: 1px solid #FFEB3B"></div>';
            //     htmlStr += 'xxxx联盟广告：' + value +'单位（%）';
            //     htmlStr += '<div style="border: 1px solid #FFEB3B"></div>';
            // }else{
                // 正常显示的数据，走默认
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
                htmlStr += seriesName + '：' + value + 'W';
            // }
            
            htmlStr += '</div>';
          }
          return htmlStr;
         }
      },
      legend: {
        data: ["Temperature", "Humidity"],
        left: 10,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: "all",
          },
        ],
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1],
        },
        {
          type: "inside",
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1],
        },
      ],
      grid: [
        {
          left: 60,
          right: 50,
          height: "35%",
        },
        {
          left: 60,
          right: 50,
          top: "55%",
          height: "35%",
        },
      ],
      xAxis: [
        {
          // type: "category",
          // boundaryGap: false,
          // axisLine: {
          //   onZero: true,
          // },
          axisLabel: {
            formatter: (val: number) => {
              return dayjs(val).format(defaultFormat);
            }
          },
          data: timeData,
        },
        {
          gridIndex: 1,
          // type: "category",
          boundaryGap: false,
          // axisLine: {
          //   onZero: true,
          // },
          axisLabel: {
            formatter: (val: number) => {
              return dayjs(val).format(defaultFormat);
            }
          },
          data: timeData,
          // position: "top", // 坐标轴位置
        },
      ],
      yAxis: [
        {
          name: "Temperature(m³/s)",
          type: "value",
          // max: 500,
        },
        {
          gridIndex: 1,
          name: "Humidity(mm)",
          type: "value",
          inverse: false, // 是否是反向坐标轴
        },
      ],
      series: [
        {
          name: "Temperature",
          type: "line",
          symbolSize: 8,
          // prettier-ignore
          data: temperatureData,
        },
        {
          name: "Humidity",
          type: "line",
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          // prettier-ignore
          data: humidityData,
        },
      ],
    };

    onMounted(() => {
      const chartDom: any = document.getElementById("linkageLine");
      const myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
    })


    return {};
  },
});
</script>

<style scoped>
#linkageLine {
  width: 100%;
  height: 100%;
}
</style>