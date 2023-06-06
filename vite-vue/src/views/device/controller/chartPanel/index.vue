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

    <div
      :class="{ 'scale-box': true, 'scale-center': scaleObj.scale < 1 }"
      :style="scaleStyle"
    >
      <LineChart :pageName="pageName" :chartData="chartData" />
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
} from "vue";

import LineChart from "./LineChart.vue";
import {
  listenerControlChange,
  removeControlListener,
  listenerStandardType,
  listenerScaleOption,
} from "../useMitt";
import { QueryChartObj, LineChartData, SettingsArr, SettingsArrItem } from "../types";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { realChartData } from "../controller.api";

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

    // 折线图源数据
    const chartData = computed(() => {
      let arr: LineChartData = [];
      if (pageName.value == "Simulation") {
        // setChangePlan(dataSource);
        arr = dataSource.value;
      } else if (pageName.value == "Protocol") {
        // arr = [...realDataSource.value, ...dataSource.value];
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
          realDataSource.value = data || [];
        }
      });
    };

    // 实际曲线页面时，进入页面即查询实际值
    if (pageName.value == "Protocol") {
      watch(injectDeviceObj, () => {
        const nowTimestamp = new Date().getTime();
        const prevNowTimestamp = nowTimestamp - 43200000;
        const startTime = dayjs(prevNowTimestamp).format(defaultFormat);
        const endTime = dayjs(nowTimestamp).format(defaultFormat);
        queryParam.dateType = "minute";
        queryParam.dateArr = [startTime, endTime];
        setIntervalFun();
      });
    }

    const settingsArr = ref<SettingsArr>([]); // 设置的数据

    // 组装折线图需要的数据
    const setDataSource = () => {
      dataSource.value = [];
      const _setArr = settingsArr.value;

      if (!_setArr || !_setArr.length) {
        return;
      }

      let dataArr = [];
      let startTimeStamp = new Date().getTime() + 60000;
      let duration = 0;

      let loopIndex: number = 0; // 循环box左侧 index
      let loopNum: number = 0; // 循环次数

      const returnArr = (parentObj: any, timestamp: number, valKey: string) => {
        const _date = dayjs(timestamp).format(defaultFormat);
        let resArr = [];

        for (const panelType of needPanelRowList.value) {
          const _val = parentObj[panelType][valKey];
          resArr.push({
            panelType,
            date: _date,
            value: _val,
            bandMax: _val + parentObj[panelType]["bandMax"],
            bandMin: _val + parentObj[panelType]["bandMin"],
          });
        }

        return resArr;
      };

      for (let i = 0; i < _setArr.length; i++) {
        const item: SettingsArrItem = _setArr[i];

        if (item.btnType == "value") {
          // 起始值为第一个 startValue
          if (duration === 0) {
            const resArr = returnArr(item, startTimeStamp, "startValue");
            dataArr.push(...resArr);
          }

          duration += item.duration!;
          const durTimeStamp = startTimeStamp + duration * 60 * 1000;
          const resArr = returnArr(item, durTimeStamp, "endValue");
          dataArr.push(...resArr);
          
        } else if (item.btnType == "loop") {
          if (!item.isRightLoop) {
            loopIndex = i;
            loopNum = item.loop!;
          } else {
            loopNum--;
            if (loopNum > 0) {
              i = loopIndex;
            }
          }

        } else if (item.btnType == "reservation" && item.date) {
          startTimeStamp = new Date(item.date).getTime();
        }
      }

      dataSource.value = dataArr;
      console.log("=== 组装好的折线图数据: ", dataArr);
    };

    const changePageName: any = inject("changePageName");
    watch(changePageName, (showPage: string) => {
      // 切换到预览页面则重新组装数据
      if (showPage == "Simulation") {
        setDataSource();
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
      scale: 1,
    });
    const scaleStyle = computed(() => {
      const _width = scaleObj.width >= 100 ? 100 : scaleObj.width;
      const _height = scaleObj.width >= 100 ? 100 : scaleObj.width;
      return {
        width: `${_width}%`,
        height: `${_height}%`,
        transform: `scale(${scaleObj.scale})`,
      };
    });

    // 监听放大缩小按钮点击
    listenerScaleOption((type: string) => {
      if (changePageName.value == pageName.value) {
        if (type == "amplify") {
          // 放大
          scaleObj.width *= 0.8;
          scaleObj.height *= 0.8;
          scaleObj.scale *= 1.25;
        } else if (type == "reduce") {
          // 缩小
          scaleObj.width = scaleObj.width * 1.25;
          scaleObj.height = scaleObj.height * 1.25;
          scaleObj.scale *= 0.8;
        } else if (type == "restore") {
          // 还原
          scaleObj.width = 100;
          scaleObj.height = 100;
          scaleObj.scale = 1;
        }
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
      scaleObj,
      scaleStyle,
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
  padding: 50px 20px;
  box-sizing: border-box;
}
.scale-box {
  transform-origin: left top;
}
.scale-center {
  transform-origin: center;
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
