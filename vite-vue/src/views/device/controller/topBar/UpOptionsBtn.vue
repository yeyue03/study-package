<template>
  <div class="option-box">
    <!-- 保存计划 -->
    <div class="option-item scale-btn" @click="choseOption('save')">
      <i class="iconfont icon-save"></i>
    </div>

    <!-- 新增计划模板 -->
    <div class="option-item scale-btn" @click="choseOption('saveTemplate')">
      <i class="iconfont icon-jiajianzujianjiahao"></i>
    </div>

    <!-- 停止 -->
    <div v-show="isRun" class="option-item scale-btn" @click="choseOption('stop')">
      <i class="iconfont icon-zanting"></i>
    </div>

    <!-- 启动 -->
    <div v-show="!isRun" class="option-item scale-btn" @click="choseOption('start')">
      <i class="iconfont icon-start"></i>
    </div>

    <!-- 方案 -->
    <div class="option-item scale-btn" @click="choseOption('scheme')">
      <i class="iconfont icon-wj-fa"></i>

      <div v-if="isShowStandard" class="select-box">
        <a-select v-model:value="standardType" defaultOpen v-focus @change="changeStandard" @blur="blurStandard">
          <a-select-option value="temperature">温度</a-select-option>
          <a-select-option value="humidity">湿度</a-select-option>
          <a-select-option value="both">温湿度</a-select-option>
        </a-select>
      </div>
    </div>

    <!-- 标准 -->
    <div class="option-item scale-btn" @click="choseOption('standard')">
      <i class="iconfont icon-biaozhun"></i>
    </div>

    <!-- 方案保存弹窗 -->
    <PopSaveScheme ref="popSaveSchemeRef" />

    <!-- 方案列表弹窗 -->
    <PopSchemeList ref="popSchemeListRef" />
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent, inject } from 'vue';
  import { listenerControlChange, listenerPlanDetailChange, setStandardType, setControlRefresh, listenerChangePlan } from '../useMitt';
  import type { ControlObj } from '../types';
  import PopSaveScheme from './PopSaveScheme.vue';
  import PopSchemeList from './PopSchemeList.vue';
  import {planAdd, planDataAdd, planEnable, planDisable} from '../controller.api';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';

  export default defineComponent({
    name: 'UpOptionsBtn',
    components: {
      PopSaveScheme,
      PopSchemeList,
    },
    directives: {
      focus: {
        mounted: (el: any) => el.querySelector('input').focus(),
      },
    },
    setup() {
      const popSaveSchemeRef = ref();
      const popSchemeListRef = ref();
      const standardType = ref('temperature');
      const isShowStandard = ref(false);
      const isRun = ref(false);
      const submitLoading = ref(false);

      const injectDeviceObj = inject('changeDeviceObj', {}); // 设备信息

      const saveDataObj = ref();
      listenerControlChange((obj: ControlObj) => {
        console.log('== listtener 更新', obj);
        saveDataObj.value = obj;
      });

      const planData = ref();
      listenerChangePlan((obj: any) => {
        console.log('== changePlan 更新', obj);
        planData.value = obj;
      });

      const planId = ref(); // 计划id
      listenerPlanDetailChange((obj: any) => {
        console.log('======== 详情：', obj);
        planId.value = obj.id;
        isRun.value = obj.isRun;
        standardType.value = obj.standardType || 'temperature';
      });

      const defaultFormat = 'YYYY-MM-DD HH:mm';

      const savePlanData = () => {
        submitLoading.value = true;
        const savePlanData = planData.value;

        const deviceObj = injectDeviceObj.value;
        savePlanData.value.forEach((data) => {
          data.deviceId = deviceObj.id;
        });

        planDataAdd(savePlanData.value)
          .then((res) => {
            console.log('== 保存 res: ', res);
            message.success('操作成功');
            submitLoading.value = false;
            setControlRefresh();
          })
          .catch(() => {
            submitLoading.value = false;
          });
      };
      const savePlan = () => {
        submitLoading.value = true;
        const savePlanObj = saveDataObj.value;
        console.log('=== saveDataObj: ', savePlanObj);
        // dayjs(nowTimeStamp).format(defaultFormat)

        // 获取 startTime 逻辑 star：标准温度取温度预约时间，湿度取湿度，温湿度谁前取谁，都没有取下一分钟
        const stdType = standardType.value;
        const temperatureStartTime = savePlanObj['temperature'][0]?.date;
        const humidityStartTime = savePlanObj['humidity'][0]?.date;
        const nextMinute = dayjs(new Date().getTime() + 60000).format(defaultFormat);
        let startTime = '';
        if (stdType == 'temperature') {
          startTime = temperatureStartTime || nextMinute;
        } else if (stdType == 'humidity') {
          startTime = humidityStartTime || nextMinute;
        } else if (stdType == 'both') {
          if (temperatureStartTime && humidityStartTime) {
            const tTimestamp = new Date(temperatureStartTime).getTime();
            const hTimestamp = new Date(humidityStartTime).getTime();
            startTime = tTimestamp > hTimestamp ? humidityStartTime : temperatureStartTime;
          } else {
            startTime = temperatureStartTime || humidityStartTime || nextMinute;
          }
        }
        // 获取 startTime 逻辑 end

        const deviceObj = injectDeviceObj.value;
        const params = {
          standardType: standardType.value,
          deviceId: deviceObj.id,
          settings: JSON.stringify(savePlanObj),
          startTime,
          isRun: false,
        };

        planAdd(params)
          .then((res) => {
            console.log('== 保存 res: ', res);
            message.success('操作成功');
            submitLoading.value = false;
            setControlRefresh();
          })
          .catch(() => {
            submitLoading.value = false;
          });
      };

      // 启动、暂停
      const startOrStop = (bool: boolean) => {
        if (!planId.value) {
          message.warning('请先保存计划');
        }

        const params = {
          id: planId.value,
        };
        const fetch = bool ? planEnable : planDisable;
        fetch(params).then((res) => {
          console.log('启动、暂停：', res);
          setControlRefresh();
        });
      };

      const choseOption = (type: string) => {
        if (!injectDeviceObj.value?.id) {
          return message.warning('请先选取设备');
        } else {
          if (type == 'save') {
            savePlan();
            savePlanData();
          } else if (type == 'saveTemplate') {
            popSaveSchemeRef.value.showModal(saveDataObj.value, standardType.value);
          } else if (type == 'scheme') {
            popSchemeListRef.value.showModal(injectDeviceObj.value?.id);
          } else if (type == 'standard') {
            isShowStandard.value = true;
          } else if (type == 'start') {
            startOrStop(true);
          } else if (type == 'stop') {
            startOrStop(false);
          }
        }
      };

      const changeStandard = (value: string) => {
        standardType.value = value;
        setStandardType(value);
      };

      const blurStandard = () => {
        isShowStandard.value = false;
      };

      return {
        standardType,
        isShowStandard,
        isRun,
        popSaveSchemeRef,
        popSchemeListRef,
        submitLoading,
        choseOption,
        changeStandard,
        blurStandard,
      };
    },
  });
</script>

<style lang="less" scoped>
  .option-box {
    position: relative;
    display: flex;
    margin-right: 10px;
  }
  .option-item {
    position: relative;
    z-index: 2;
    width: 40px;
    height: 40px;
    margin: 3px 0 0 3px;
    text-align: center;
    background: #333;
    border-top: solid 2px #aaa;
    border-left: solid 2px #aaa;
    border-bottom: solid 1px #555;
    border-right: solid 1px #555;
    box-shadow: -2px -2px 3px 1px #333;
    cursor: pointer;

    .iconfont {
      font-size: 28px;
      line-height: 40px;
    }
    .icon-shidu {
      font-size: 22px;
    }
    .line {
      position: absolute;
      top: 12px;
      right: 5px;
      width: 23px;
      height: 0;
      border-top: solid 2px yellow;
    }
    .rotate {
      top: 18px;
      right: 1px;
      width: 28px;
      transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
    }
    .select-box {
      position: absolute;
      left: 30px;
      top: 17px;
      overflow: hidden;
      width: 1px;
      height: 1px;
    }
    .ant-select {
      width: 120px;
    }
  }
</style>
