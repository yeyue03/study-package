<template>
  <div class="panel-wrap">
    <div v-show="pageName == 'Protocol'" class="search-box">
      <div class="search-item">
        <div class="item-box">
          <span>日期：</span>
          <a-range-picker
            v-model:value="queryParam.dateArr"
            showTime
            format="YYYY-MM-DD HH:mm"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>

        <div class="item-box">
          <span>查询类别：</span>
          <a-select v-model:value="queryParam.dateType">
            <a-select-option value="day">按天</a-select-option>
            <a-select-option value="hour">小时</a-select-option>
            <a-select-option value="minute">分钟</a-select-option>
          </a-select>
        </div>
      </div>

      <a-button type="primary" @click="setIntervalFun">查询</a-button>
    </div>

    <div ref="chartWrapBoxRef" class="scale-box">
      <LineChart ref="chartComponentRef" :pageName="pageName" :chartData="chartData" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  onBeforeUnmount,
  reactive,
  toRefs,
  watch,
  computed,
  inject,
  nextTick
} from "vue";

import LineChart from "./LineChart.vue";
import {
  listenerControlChange,
  removeControlListener,
  listenerStandardType,
  listenerScaleOption,
} from "../useMitt";
import { QueryChartObj, LineChartData, SettingsArr } from "../types";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { realChartData } from "../controller.api";
import { getChartDataSource } from '../device';

export default defineComponent({
  name: "ChartPanel",
  components: {
    LineChart,
  },
  props: {
    pageName: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const { pageName } = toRefs(props);
    const defaultFormat = "YYYY-MM-DD HH:mm";
    const dataSource = ref<LineChartData>([]);
    const realDataSource = ref<LineChartData>([]);
    const chartWrapBoxRef = ref();
    const chartComponentRef = ref();

    // 折线图源数据
    const chartData = computed(() => {
      let arr: LineChartData = [];
      if (pageName.value == "Simulation") {
        arr = dataSource.value;
      } else if (pageName.value == "Protocol") {
        arr = realDataSource.value;
      }

      return arr;
    });


    const queryParam = reactive<QueryChartObj>({
      dateArr: [],
      dateType: "",
    });

    const needPanelRowList: any = inject("changePanelRowList", [
      "temperature",
      "humidity",
      "beam",
    ]); // 该设备含有的面板类似 温度、湿度、光照
    const injectDeviceObj: any = inject("changeDeviceObj", {});
    const _interval = ref();

    // 查询开启计时器
    const setIntervalFun = () => {
      if (!injectDeviceObj.value?.id) {
        return message.warning("请先选取设备");
      } else if (!queryParam.dateArr || !queryParam.dateArr.length) {
        return message.warning("请选择日期");
      } else if (!queryParam.dateType) {
        return message.warning("请选择查询类别");
      }

      const startTimeStamp = new Date(queryParam.dateArr[0]).getTime();
      const endTimeStamp = new Date(queryParam.dateArr[1]).getTime();
      const diffV = endTimeStamp - startTimeStamp;

      if (queryParam.dateType == "minute" && diffV > 172800000) {
        return message.warning("日期范围超过两天，类别不可选分钟");
      } else if (
        (queryParam.dateType == "minute" || queryParam.dateType == "hour") &&
        diffV > 7776000000
      ) {
        return message.warning("日期范围超过90天，类别不可选分钟或小时");
      }

      clearInterval(_interval.value);
      _interval.value = null;

      getRealValueList();
      _interval.value = setInterval(() => {
        getRealValueList();
      }, 60000);
    };

    // 获取实际值数组
    const getRealValueList = () => {
      realDataSource.value = [];
      const params = {
        deviceId: injectDeviceObj.value?.id,
        startTime: queryParam.dateArr[0],
        endTime: queryParam.dateArr[1],
        type: queryParam.dateType,
      };
      realChartData(params).then((data: any) => {
        if (data && data.length) {
          let resArr: any = [];
          for (const item of data) {
            for (const panelType of needPanelRowList.value) {
              let _val = item.temperature;
              let setVal = item.setTemperature;
              let bandMax = item.temperatureMax;
              let bandMin = item.temperatureMin;

              if (panelType == 'humidity') {
                _val = item.humidity;
                setVal = item.setHumidity;
                bandMax = item.humidityMax;
                bandMin = item.humidityMin;

              } else if (panelType == 'beam') {
                _val = item.beam;
                setVal = item.setBeam;
                bandMax = item.beamMax;
                bandMin = item.beamMin;
              }

              resArr.push({
                panelType,
                date: item.date,
                value: _val,
                setVal,
                bandMax,
                bandMin,
              });
            }
          }

          realDataSource.value = resArr;
        }
      });
    };

    // 设备变更
    watch(injectDeviceObj, () => {
      // 实际曲线页面时，进入页面即查询实际值
      if (pageName.value == "Protocol") {
        const nowTimestamp = new Date().getTime();
        const prevNowTimestamp = nowTimestamp - 43200000;
        const startTime = dayjs(prevNowTimestamp).format(defaultFormat);
        const endTime = dayjs(nowTimestamp).format(defaultFormat);
        queryParam.dateType = "minute";
        queryParam.dateArr = [startTime, endTime];
        setIntervalFun();

      } else { // 预览刷新 加计时器防止 settingsArr未变更
        setTimeout(() => {
          const _arr: any = getChartDataSource(settingsArr, needPanelRowList);
          dataSource.value = _arr;
        }, 100);
      }
    });

    const settingsArr = ref<SettingsArr>([]); // 设置的数据

    const changePageName: any = inject("changePageName");
    watch(changePageName, (showPage: string) => {
      // 切换到预览页面则重新组装数据
      if (showPage == "Simulation") {
        const _arr: any = getChartDataSource(settingsArr, needPanelRowList);
        dataSource.value = _arr;
      }
    });

    const standardType = ref("temperature");
    listenerStandardType((type: string) => {
      standardType.value = type;
    });

    listenerControlChange((arr: SettingsArr) => {
      settingsArr.value = arr;
    });

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

    // 监听放大缩小按钮点击
    listenerScaleOption((type: string) => {
      if (changePageName.value == pageName.value) {
        scaleObj.width = chartWrapBoxRef.value.clientWidth;

        if (type == "amplify") { // 放大
          scaleObj.scale++;
        } else if (type == "reduce") { // 缩小
          scaleObj.scale--;
        } else if (type == "restore") { // 还原
          scaleObj.scale = 0;
        }

        scaleObj.height = initHeight + scaleObj.scale * 50;
        chartComponentRef.value.changeChartSize(scaleObj);
      }

    });

    onBeforeUnmount(() => {
      clearInterval(_interval.value);
      _interval.value = null;
      removeControlListener();
    });

    return {
      queryParam,
      dataSource,
      realDataSource,
      chartWrapBoxRef,
      chartComponentRef,
      scaleObj,
      chartData,
      getRealValueList,
      setIntervalFun,
    };
  },
});
</script>

<style lang="less" scoped>
.panel-wrap {
  width: 100%;
  padding: 50px 20px 40px;
  box-sizing: border-box;
}
.scale-box {
  width: 100%;
}
:deep(.ant-spin-container::after) {
  background: none;
}

.search-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 60px 10px;
  box-sizing: border-box;
  .search-item {
    display: flex;
    align-items: center;
  }
  .item-box {
    margin-right: 8px;
  }
  .ant-select {
    width: 120px;
  }
}
</style>
