<template>
  <a-spin :spinning="pageLoading">
    <div class="panel-wrap">
      <div v-show="pageName == 'Protocol'" class="search-box">
        <div class="search-item">
          <div class="item-box">
            <span>日期：</span>
            <a-range-picker v-model:value="queryParam.dateArr" showTime format="YYYY-MM-DD HH:mm" valueFormat="YYYY-MM-DD HH:mm" />
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

      <LineChart :pageName="pageName" :chartData="chartData" />
    </div>
  </a-spin>
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
  provide
} from 'vue';
  import LineChart from './LineChart.vue';
import {
  listenerControlChange,
  removeControlListener,
  listenerStandardType,
  setChangePlan,
  setControlChange
} from '../useMitt';
  import type { PanelChildObj, PanelObj, LineChartDataObj } from '../types';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { realChartData } from '../controller.api';

  export default defineComponent({
    name: 'ChartPanel',
    components: {
      LineChart,
    },
    props: {
      pageName: {
        type: String,
        default: () => {
          return '';
        },
      },
    },
    setup(props) {
      const { pageName } = toRefs(props);
      const defaultFormat = 'YYYY-MM-DD HH:mm';
      const dataSource = ref([]);
      const realDataSource = ref([]);
      const chartData = computed(() => {
        let arr = [];
        if (pageName.value == 'Simulation') {
          setChangePlan(dataSource);
          arr = dataSource.value;
        } else if (pageName.value == 'Protocol') {
          arr = [...realDataSource.value, dataSource.value];
        }

        return arr;
      });
      const queryParam = reactive({
        dateArr: [],
        dateType: '',
      });

      const injectDeviceObj = inject('changeDeviceObj', {});
      const _interval = ref();

      const setIntervalFun = () => {
        if (!injectDeviceObj.value?.id) {
          return message.warning('请先选取设备');
        } else if (!queryParam.dateArr || !queryParam.dateArr.length) {
          return message.warning('请选择日期');
        } else if (!queryParam.dateType) {
          return message.warning('请选择查询类别');
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
        realChartData(params).then((data) => {
          if (data && data.length) {
            let arr = [];
            for (const item of data) {
              arr.push({
                type: 'temperature',
                time: item.date,
                dec: '实际',
                value: item.temperature,
              });

              arr.push({
                type: 'humidity',
                time: item.date,
                dec: '实际',
                value: item.humidity,
              });

              arr.push({
                type: 'temperature',
                time: item.date,
                dec: '预设',
                value: item.setTemperature,
              });

              arr.push({
                type: 'humidity',
                time: item.date,
                dec: '预设',
                value: item.setHumidity,
              });
            }

            realDataSource.value = arr;
          }
        });
      };

      if (pageName.value == 'Protocol') {
        watch(injectDeviceObj, () => {
          const nowTimestamp = new Date().getTime();
          const prevNowTimestamp = nowTimestamp - 43200000;
          const startTime = dayjs(prevNowTimestamp).format(defaultFormat);
          const endTime = dayjs(nowTimestamp).format(defaultFormat);
          queryParam.dateType = 'minute';
          queryParam.dateArr = [startTime, endTime];
          setIntervalFun();
        });
      }

      const pageLoading = ref(false);
      watch(pageName, () => {
        pageLoading.value = true;
        setTimeout(() => {
          pageLoading.value = false;
        }, 500);
      });

      // 把分钟数转化为 hh:mm
      const getDateStr = (value: string | number) => {
        value = parseInt(value);
        let hour: string | number = Math.floor(value / 60);
        let minute: string | number = value % 60;

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        return hour + ':' + minute;
      };

      let dataArr: LineChartDataObj[] = [];
      let duration = 0;
      let nowTimeStamp = 0;
      const setDataSource = (key: string, list: PanelChildObj[]) => {
        if (!list) {
          return;
        }

        for (const item of list) {
          if (item.btnType == 'value') {
            if (duration === 0) {
              dataArr.push({ type: key, time: dayjs(nowTimeStamp).format(defaultFormat), value: item.startValue });
            }
            duration += item.duration;
            nowTimeStamp += duration * 60 * 1000;
            dataArr.push({ type: key, time: dayjs(nowTimeStamp).format(defaultFormat), value: item.endValue });
          } else if (item.btnType == 'loop') {
            for (let num = 0; num < item.loop; num++) {
              setDataSource(key, item.loopChilds);
            }
          } else if (item.btnType == 'reservation') {
            nowTimeStamp = new Date(item.date).getTime();
          }
        }
      };

      const standardType = ref('temperature');
      listenerStandardType((type: string) => {
        console.log('== 选中：', pageName.value, type);

        standardType.value = type;
      });

      listenerControlChange((obj: PanelObj) => {
        dataSource.value = [];
        nowTimeStamp = new Date().getTime();

        if (obj) {
          for (let [key, value] of Object.entries(obj)) {
            dataArr = [];
            duration = 0;
            setDataSource(key, value);
            nowTimeStamp += 24 * 60 * 60 * 1000;
            dataArr.push({ type: key, time: dayjs(nowTimeStamp).format(defaultFormat), value: undefined });
            dataSource.value.push(...dataArr);
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
        chartData,
        pageLoading,
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
    /* background: #fff; */
  }

  :deep(.ant-spin-container::after) {
    background: none;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
