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

    <div ref="chartWrapBoxRef" class="scale-box" @wheel.prevent="handleWheel">
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
import { getChartDataSource, debounce } from '../device';

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

    // 放大缩小相关变量
    const scaleObj = reactive({
      width: 100,
      height: 100,
      scale: 0,
      tickCount: 5,
      minTimestamp: 0,
      maxTimestamp: 0,
      initStartTimestamp: 0,
      initEndTimestamp: 0,
      dateType: "minute"
    });

    let initHeight: number = 500; // chart初始高度
    nextTick(() => {
      initHeight = chartWrapBoxRef.value.clientHeight;
    })

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

      scaleObj.minTimestamp = startTimeStamp;
      scaleObj.maxTimestamp = endTimeStamp;
      scaleObj.dateType = queryParam.dateType;

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

              const timestamp = (new Date(item.date)).getTime();
              resArr.push({
                panelType,
                date: item.date,
                value: _val,
                setVal,
                bandMax,
                bandMin,
                timestamp
              });
            }
          }

          realDataSource.value = resArr;

          scaleObj.width = chartWrapBoxRef.value.clientWidth;
          scaleObj.height = initHeight;
          
          scaleProtocol("restore");
        }
      });
    };

    // 监听 设备变更
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

          setInitScaleObj(_arr);
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

        setInitScaleObj(_arr);
      }
    });

    const standardType = ref("temperature");
    listenerStandardType((type: string) => {
      standardType.value = type;
    });

    listenerControlChange((arr: SettingsArr) => {
      settingsArr.value = arr;
    });

    // 设置初始缩放配置 预览页面用，Protocol页面走不同方法
    const setInitScaleObj = (_arr: LineChartData = []) => {
      const initStartTimestamp = _arr[0].timestamp || 0;
      const initEndTimestamp = _arr[_arr.length - 1].timestamp || 0;

      scaleObj.minTimestamp = initStartTimestamp;
      scaleObj.maxTimestamp = initEndTimestamp;
      scaleObj.initStartTimestamp = initStartTimestamp;
      scaleObj.initEndTimestamp = initEndTimestamp;

      scaleObj.width = chartWrapBoxRef.value.clientWidth;
      scaleObj.height = initHeight;

      scaleSimulation("restore")
    }

    // 缩放事件前判断 加防抖机制
    const judgeScale = debounce((type: string) => {
      scaleObj.width = chartWrapBoxRef.value.clientWidth;

      if (pageName.value == 'Protocol') {
        scaleProtocol(type);
      } else if (pageName.value == 'Simulation') {
        scaleSimulation(type);
      }
    }, 1000)

    // 监听放大缩小按钮点击
    listenerScaleOption((type: string) => {
      if (changePageName.value == pageName.value) {
        judgeScale(type);
      }
    });

    // 监听 鼠标滚轮
    const handleWheel = (e: any) => {
      // e.wheelDelta < 0 下滑 放大
      // e.wheelDelta > 0 上滑 缩小
      const type = e.wheelDelta < 0 ? 'amplify' : 'reduce';
      judgeScale(type);
    }

    // 实际 页面放大缩小
    const scaleProtocol = (type: string) => {
      let dType = scaleObj.dateType;

      let scaleTimeRang: number = 5 * 60 * 1000; // 放大缩小x轴缩放值
      if (dType == "hour") {
        scaleTimeRang = 60 * 60 * 1000;
      } else if (dType == "day") {
        scaleTimeRang = 24 * 60 * 60 * 1000;
      }

      if (type == "amplify") { // 放大
        scaleObj.scale++;
        scaleObj.tickCount++;
        scaleObj.minTimestamp -= scaleTimeRang;
        scaleObj.maxTimestamp += scaleTimeRang;

      } else if (type == "reduce" && scaleObj.scale > -5) { // 缩小
        const redMin = scaleObj.minTimestamp + scaleTimeRang;
        const redMax = scaleObj.maxTimestamp - scaleTimeRang;
        if (redMin < redMax) {
          scaleObj.scale--;
          scaleObj.tickCount > 2 && scaleObj.tickCount--;
          scaleObj.minTimestamp = redMin;
          scaleObj.maxTimestamp = redMax;

        } else {
          return message.warning('不可继续缩小');
        }

      } else if (type == "restore") { // 还原
        scaleObj.scale = 0;
        scaleObj.tickCount = 4;
      }

      // 实际时 还原只还原图表高度，不调接口
      if (type != "restore") {
        const diffV = scaleObj.maxTimestamp - scaleObj.minTimestamp;
        if (diffV >= 7776000000) { // 日期范围超过90天
          dType = 'day';
        } else if (diffV >= 172800000) { // 日期范围超过两天
          dType = dType == 'hour' || dType == 'day' ? dType : 'hour';
        } else {
          dType = 'minute';
        }

        const startTime = dayjs(scaleObj.minTimestamp).format(defaultFormat);
        const endTime = dayjs(scaleObj.maxTimestamp).format(defaultFormat);
  
        queryParam.dateType = dType;
        queryParam.dateArr = [startTime, endTime];
        setIntervalFun();
      }

      if (scaleObj.scale >= -5) {
        scaleObj.height = initHeight + scaleObj.scale * 50;
        chartComponentRef.value.changeChartSize(scaleObj);
      }
    }

    // 预设 页面放大缩小
    const scaleSimulation = (type: string) => {
      const scaleTimeRang: number = 1 * 60 * 1000; // 放大缩小x轴缩放值
      if (type == "amplify") { // 放大
        scaleObj.scale++;
        scaleObj.tickCount++;
        scaleObj.minTimestamp -= scaleTimeRang;
        scaleObj.maxTimestamp += scaleTimeRang;

      } else if (type == "reduce" && scaleObj.scale > -5) { // 缩小
        scaleObj.scale--;
        scaleObj.tickCount > 2 && scaleObj.tickCount--;
        scaleObj.minTimestamp += scaleTimeRang;
        scaleObj.maxTimestamp -= scaleTimeRang;

      } else if (type == "restore") { // 还原
        scaleObj.scale = 0;
        scaleObj.tickCount = 4;

        scaleObj.minTimestamp = scaleObj.initStartTimestamp;
        scaleObj.maxTimestamp = scaleObj.initEndTimestamp;
      }

      if (scaleObj.scale >= -5) {
        scaleObj.height = initHeight + scaleObj.scale * 50;
        chartComponentRef.value.changeChartSize(scaleObj);
      }
    }

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
      handleWheel
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
