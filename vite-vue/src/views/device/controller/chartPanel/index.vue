<template>
  <div class="panel-wrap">
    <div v-show="pageName == 'Protocol'" class="search-box">
      <div class="search-item">
        <div class="item-box">
          <span>{{ t('device.chart.date') }}：</span>
          <a-range-picker
            v-model:value="queryParam.dateArr"
            showTime
            format="YYYY-MM-DD HH:mm"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>

        <div class="item-box">
          <span>{{ t('device.chart.dateType') }}：</span>
          <a-select v-model:value="queryParam.dateType">
            <a-select-option value="day">{{ t('device.chart.day') }}</a-select-option>
            <a-select-option value="hour">{{ t('device.chart.hour') }}</a-select-option>
            <a-select-option value="minute">{{ t('device.chart.minute') }}</a-select-option>
          </a-select>
        </div>
      </div>

      <a-button type="primary" @click="setIntervalFun">{{ t('device.chart.search') }}</a-button>
    </div>

    <div ref="chartWrapBoxRef" class="scale-box" @wheel.prevent="handleWheel">
      <LineChart ref="chartComponentRef" :pageName="pageName" :chartData="chartData" />
    </div>

    <div v-if="maskLoading" class="load-mask">
      <a-spin tip="Loading..." size="large"></a-spin>
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
import { QueryChartObj, LineChartData, LineChartDataObj, SettingsArr } from "../types";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { realChartData } from "../controller.api";
import { getChartDataSource, debounce } from '../device';
import { useI18n } from '@/hooks/web/useI18n';

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
    const { t } = useI18n();
    const { pageName } = toRefs(props);
    const defaultFormat = "YYYY-MM-DD HH:mm";
    const dataSource = ref<LineChartData>([]);
    const realDataSource = ref<LineChartData>([]);
    const chartWrapBoxRef = ref();
    const chartComponentRef = ref();
    const maskLoading = ref(false);

    // 放大缩小相关变量
    const scaleObj = reactive({
      width: 100,
      height: 100,
      scale: 0,
      tickCount: 6,
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
        return message.warning(t('device.tips.pleaseChoseDevice'));
      } else if (!queryParam.dateArr || !queryParam.dateArr.length) {
        return message.warning(t('device.tips.pleaseChoseDate'));
      } else if (!queryParam.dateType) {
        return message.warning(t('device.tips.pleaseChoseDateType'));
      }

      const startTimeStamp = new Date(queryParam.dateArr[0]).getTime();
      const endTimeStamp = new Date(queryParam.dateArr[1]).getTime();
      const diffV = endTimeStamp - startTimeStamp;

      if (queryParam.dateType == "minute" && diffV > 172800000) {
        return message.warning(t('device.tips.exceedTwoDay'));
      } else if (
        (queryParam.dateType == "minute" || queryParam.dateType == "hour") &&
        diffV > 7776000000
      ) {
        return message.warning(t('device.tips.exceed90Day'));
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
      maskLoading.value = true;

      const params = {
        deviceId: injectDeviceObj.value?.id,
        startTime: queryParam.dateArr[0],
        endTime: queryParam.dateArr[1],
        type: queryParam.dateType,
      };

      realChartData(params).then((data: any) => {
        maskLoading.value = false;
        let resArr: any = [];
        if (data && data.length) {
          for (const item of data) {
            for (const panelType of needPanelRowList.value) {
              let _val = item.temperature; // 实际值
              let setVal = item.setTemperature; // 设定值
              let bandMax = item.temperatureMax; // 上方差值
              let bandMin = item.temperatureMin; // 下方差值

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
              let _obj: LineChartDataObj = {
                panelType,
                date: item.date,
                value: _val,
                setVal,
                bandMax,
                bandMin,
                timestamp
              }

              resArr.push(_obj);
            }
          }
        }
        realDataSource.value = resArr;

        scaleObj.width = chartWrapBoxRef.value.clientWidth;
        scaleObj.height = initHeight;
        scaleProtocol("refresh");

      }).catch(() => {
        maskLoading.value = false;
      });
    };

    // 监听 设备变更
    watch(injectDeviceObj, () => {
      // 实际曲线页面时，进入页面即查询实际值
      if (pageName.value == "Protocol") {
        const nowTimestamp = new Date().getTime();
        const prevNowTimestamp = nowTimestamp - 36000000;
        const nextNowTimestamp = nowTimestamp + 7200000;
        const startTime = dayjs(prevNowTimestamp).format(defaultFormat);
        const endTime = dayjs(nextNowTimestamp).format(defaultFormat);
        queryParam.dateType = "minute";
        queryParam.dateArr = [startTime, endTime];
        // queryParam.dateArr = ['2023-06-30 00:00', '2023-07-01 06:00']; // 测试用
        
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
      // changePageName: 代表当前切换到的页面
      // pageName: 代表当前组件所属父级页面
      // 切换到预览页面则重新组装数据
      if (showPage == "Simulation" && pageName.value == "Simulation") {
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
      const initStartTimestamp = _arr[0]?.timestamp || 0;
      const initEndTimestamp = _arr[_arr.length - 1]?.timestamp || 0;

      scaleObj.minTimestamp = initStartTimestamp;
      scaleObj.maxTimestamp = initEndTimestamp;
      scaleObj.initStartTimestamp = initStartTimestamp;
      scaleObj.initEndTimestamp = initEndTimestamp;

      scaleObj.width = chartWrapBoxRef.value.clientWidth;
      scaleObj.height = initHeight;

      scaleSimulation("restore")
    }

    // 缩放事件前判断 加防抖机制
    const timeslot: number = pageName.value == 'Simulation' ? 50 : 1000;
    const judgeScale = debounce((type: string) => {
      scaleObj.width = chartWrapBoxRef.value.clientWidth;

      if (pageName.value == 'Protocol') {
        scaleProtocol(type);
      } else if (pageName.value == 'Simulation') {
        scaleSimulation(type);
      }
      maskLoading.value = false;
    }, timeslot)

    // 监听放大缩小按钮点击
    listenerScaleOption((type: string) => {
      if (changePageName.value == pageName.value) {
        if (type == 'reduce' && scaleObj.scale <= -4) {
          return message.warning(t('device.tips.hadMinimum'));
        } else {
          maskLoading.value = true;
          judgeScale(type);
        }
      }
    });

    // 监听 鼠标滚轮
    const handleWheel = (e: any) => {
      // e.wheelDelta < 0 下滑 放大
      // e.wheelDelta > 0 上滑 缩小
      const type = e.wheelDelta < 0 ? 'reduce' : 'amplify';
      if (type == 'reduce' && scaleObj.scale <= -4) {
        return message.warning(t('device.tips.hadMinimum'));
      } else {
        maskLoading.value = true;
        judgeScale(type);
      }
    }

    // 实际 页面放大缩小
    const scaleProtocol = (type: string) => {
      let dType = scaleObj.dateType;

      let scaleTimeRang: number = 10 * 60 * 1000; // 放大缩小x轴缩放值
      if (dType == "hour") {
        scaleTimeRang = 60 * 60 * 1000;
      } else if (dType == "day") {
        scaleTimeRang = 24 * 60 * 60 * 1000;
      }

      if (type == "amplify") { // 放大
        const redMin = scaleObj.minTimestamp + scaleTimeRang;
        const redMax = scaleObj.maxTimestamp - scaleTimeRang;
        
        const tickCount = Math.floor((scaleObj.width - 120) / 33);
        const maxTickMin = tickCount * 60 * 1000; // 间隔多少分钟（按间隔算，防止显示相同分钟）

        if (redMax - redMin > maxTickMin || scaleObj.scale < 0) {
          scaleObj.scale++;
          scaleObj.tickCount++;
          scaleObj.minTimestamp = redMin;
          scaleObj.maxTimestamp = redMax;

        } else {
          return message.warning(t('device.tips.dateNear'));
        }

      } else if (type == "reduce" && scaleObj.scale > -5) { // 缩小
        scaleObj.scale--;
        scaleObj.tickCount > 3 && scaleObj.tickCount--;
        scaleObj.minTimestamp -= scaleTimeRang;
        scaleObj.maxTimestamp += scaleTimeRang;
        

      } else if (type == "restore") { // 还原
        scaleObj.scale = 0;
        scaleObj.tickCount = 6;
      }

      // 实际时 还原只还原图表高度，不调接口
      if (type != "restore" && type != "refresh") {
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

      if (scaleObj.scale > -5) {
        scaleObj.height = initHeight + scaleObj.scale * 50;
        chartComponentRef.value.changeChartSize(scaleObj);
      }
    }

    // 预设 页面放大缩小
    const scaleSimulation = (type: string) => {
      const scaleTimeRang: number = 1 * 60 * 1000; // 放大缩小x轴缩放值
      if (type == "amplify") { // 放大
        const redMin = scaleObj.minTimestamp + scaleTimeRang;
        const redMax = scaleObj.maxTimestamp - scaleTimeRang;

        const tickCount = Math.floor((scaleObj.width - 120) / 33);
        const maxTickMin = tickCount * 60 * 1000; // 间隔多少分钟（按间隔算，防止显示相同分钟）
        
        if (redMax - redMin > maxTickMin || scaleObj.scale < 0) {
          scaleObj.scale++;
          scaleObj.tickCount++;
          scaleObj.minTimestamp = redMin;
          scaleObj.maxTimestamp = redMax;

        } else {
          return message.warning(t('device.tips.dateNear'));
        }

      } else if (type == "reduce" && scaleObj.scale > -5) { // 缩小
        scaleObj.scale--;
        scaleObj.tickCount > 2 && scaleObj.tickCount--;
        scaleObj.minTimestamp -= scaleTimeRang;
        scaleObj.maxTimestamp += scaleTimeRang;

      } else if (type == "restore") { // 还原
        scaleObj.scale = 0;
        scaleObj.tickCount = 6;

        scaleObj.minTimestamp = scaleObj.initStartTimestamp;
        scaleObj.maxTimestamp = scaleObj.initEndTimestamp;
      }

      if (scaleObj.scale > -5) {
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
      t,
      queryParam,
      dataSource,
      maskLoading,
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
  position: relative;
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

.load-mask {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .2);
}
</style>
