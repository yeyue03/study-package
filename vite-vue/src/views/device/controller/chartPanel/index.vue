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
          // setChangePlan(dataSource);
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

        const startTimeStamp = (new Date(queryParam.dateArr[0])).getTime();
        const endTimeStamp = (new Date(queryParam.dateArr[1])).getTime();
        const diffV = endTimeStamp - startTimeStamp;
        
        if (queryParam.dateType == 'minute' && diffV > 172800000) {
          return message.warning('日期范围超过两天，类别不可选分钟');
        } else if ((queryParam.dateType == 'minute' || queryParam.dateType == 'hour') && diffV > 7776000000) {
          return message.warning('日期范围超过90天，类别不可选分钟或小时');
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
      const settingsArr = ref([]); // 设置的数据

      const setDataSource = () => {
        dataSource.value = [];
        const _setArr = settingsArr.value;
        console.log("=== _setArr: ", _setArr);
        
        if (!_setArr || !_setArr.length) {
          return;
        }
        pageLoading.value = true;

        let dataArr = [];
        let startTimeStamp = (new Date()).getTime() + 60000;
        let duration = 0;

        let loopIndex = 0; // 循环box左侧 index
        let loopNum = 0; // 循环次数

        for (let i=0; i<_setArr.length; i++) {
          const item = _setArr[i];

          if (item.btnType == 'value') {
            const Tobj = item.temperature;
            const Hobj = item.humidity;
            const Bobj = item.beam;

            let _obj = {}

            if (duration === 0) { // 起始值为第一个 startValue
              _obj.date = dayjs(startTimeStamp).format(defaultFormat);
              if (Tobj) {
                _obj.temperature = Tobj.startValue;
                _obj.temperatureMax = Tobj.startValue + Tobj.bandMax;
                _obj.temperatureMin = Tobj.startValue + Tobj.bandMin;
              }
              if (Hobj) {
                _obj.humidity = Hobj.startValue;
                _obj.humidityMax = Hobj.startValue + Hobj.bandMax;
                _obj.humidityMin = Hobj.startValue + Hobj.bandMin;
              }
              if (Bobj) {
                _obj.beam = Bobj.startValue;
                _obj.beamMax = Bobj.startValue + Bobj.bandMax;
                _obj.beamMin = Bobj.startValue + Bobj.bandMin;
              }
              dataArr.push(JSON.parse(JSON.stringify(_obj)));
              _obj = {};
            }

            const itemDuration = Tobj?.duration || Hobj?.duration || Bobj?.duration
            duration += itemDuration;
            const durTimeStamp = startTimeStamp + duration * 60 * 1000;
            
            _obj.date = dayjs(durTimeStamp).format(defaultFormat);

            if (Tobj) {
              _obj.temperature = Tobj.endValue;
              _obj.temperatureMax = Tobj.endValue + Tobj.bandMax;
              _obj.temperatureMin = Tobj.endValue + Tobj.bandMin;
            }
            if (Hobj) {
              _obj.humidity = Hobj.endValue;
              _obj.humidityMax = Hobj.endValue + Hobj.bandMax;
              _obj.humidityMin = Hobj.endValue + Hobj.bandMin;
            }
            if (Bobj) {
              _obj.beam = Bobj.endValue;
              _obj.beamMax = Bobj.endValue + Bobj.bandMax;
              _obj.beamMin = Bobj.endValue + Bobj.bandMin;
            }
            dataArr.push(_obj);

          } else if (item.btnType == 'loop') {
            if (!item.isRightLoop) {
              loopIndex = i;
              loopNum = item.loop;
              
            } else {
              loopNum--;
              if (loopNum > 0) {
                i = loopIndex;
              }
            }

          } else if (item.btnType == 'reservation') {
            startTimeStamp = (new Date(item.date)).getTime();
          }
        }

        console.log("==== 折线图：", dataArr);
        dataSource.value = dataArr;
        pageLoading.value = false;
      };

      const changePageName = inject('changePageName');
      watch(changePageName, (showPage: string) => {
        // console.log("=== showPage: ", showPage);
        // 切换到预览页面则重新组装数据
        if (showPage == 'Simulation') {
          setDataSource();
        }
      })

      const standardType = ref('temperature');
      listenerStandardType((type: string) => {
        standardType.value = type;
      });

      listenerControlChange((arr: PanelObj) => {
        settingsArr.value = arr || [];
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
