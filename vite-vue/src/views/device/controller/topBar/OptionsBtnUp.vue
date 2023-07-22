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
    </div>

    <!-- 方案保存弹窗 -->
    <PopSaveScheme ref="popSaveSchemeRef" />

    <!-- 方案列表弹窗 -->
    <PopSchemeList ref="popSchemeListRef" />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch, inject } from 'vue';
import { listenerControlChange, setPlanDetailRefresh } from '../useMitt';
import { SettingsArr } from '../types';
import PopSaveScheme from './PopSaveScheme.vue';
import PopSchemeList from './PopSchemeList.vue';
import { planAdd, planEnable, planDisable } from '../controller.api';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: 'OptionsBtnUp',
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
    const { t } = useI18n();
    const popSaveSchemeRef = ref();
    const popSchemeListRef = ref();
    const isShowStandard = ref(false);
    const isRun = ref(false);
    const submitLoading = ref(false);

    const injectDeviceObj: any = inject('changeDeviceObj', {}); // 设备信息

    const settingsArr = ref();
    // 监听获取 settings 数据
    listenerControlChange((setArr: SettingsArr) => {
      settingsArr.value = setArr;
    });

    const planId = ref(); // 计划id
    const injectDevicePlanDetail: any = inject('changeDevicePlanDetail', {});
    watch(injectDevicePlanDetail, (newObj) => {
      planId.value = newObj.id;
      isRun.value = newObj.isRun;
    });

    const defaultFormat = 'YYYY-MM-DD HH:mm';

    // 保存计划
    const savePlan = () => {
      submitLoading.value = true;
      const _setArr = settingsArr.value;

      // 获取 startTime 逻辑 有预约取预约，没有取下一分钟
      let startTime = '';
      if (_setArr[0] && _setArr[0].btnType == 'reservation') {
        startTime = _setArr[0].date;
      }
      if (!startTime) {
        const nextMinute = dayjs(new Date().getTime() + 60000).format(defaultFormat);
        startTime = nextMinute;
      }
      // 获取 startTime 逻辑 end

      const deviceObj = injectDeviceObj.value;
      const params = {
        deviceId: deviceObj.id,
        settings: JSON.stringify(_setArr),
        startTime,
        isRun: false,
      };
      // console.log('==== 保存 settings：', params.settings);

      planAdd(params)
        .then(() => {
          message.success(t('device.tips.success'));
          submitLoading.value = false;
          setPlanDetailRefresh();
        })
        .catch(() => {
          submitLoading.value = false;
        });
    };

    // 启动、暂停
    const startOrStop = (bool: boolean) => {
      if (!planId.value) {
        message.warning(t('device.tips.pleaseSave'));
      }

      const params = {
        id: planId.value,
      };
      const fetch = bool ? planEnable : planDisable;
      fetch(params).then(() => {
        if (bool) {
          message.success(t('device.tips.startSuccess'));
        } else {
          message.success(t('device.tips.stopSuccess'));
        }
        setPlanDetailRefresh();
      });
    };

    const choseOption = (type: string) => {
      if (!injectDeviceObj.value?.id) {
        return message.warning(t('device.tips.pleaseChoseDevice'));
        
      } else {
        if (type == 'save') {
          savePlan();
        } else if (type == 'saveTemplate') {
          popSaveSchemeRef.value.showModal(settingsArr.value);
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

    const blurStandard = () => {
      isShowStandard.value = false;
    };

    return {
      isShowStandard,
      isRun,
      popSaveSchemeRef,
      popSchemeListRef,
      submitLoading,
      choseOption,
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
  background-color: #fff;
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
