<template>
  <div class="info-wrap">
    <div class="title">{{ t('device.infoPop.info') }}</div>
    <div class="info-box">
      <div class="range-box">
        <span class="range-span">{{ t('device.infoPop.deviceType') }}</span>
        <span>{{ formState.type }}</span>
      </div>

      <!-- 用户自定义名称 -->
      <div class="range-box">
        <span class="range-span">{{ t('device.infoPop.definedNmae') }}</span>
        <a-input class="long-input" v-model:value="formState.defineName"></a-input>
      </div>

      <!-- 序列号 -->
      <div class="range-box">
        <span class="range-span">{{ t('device.infoPop.serialNo') }}</span>
        <span>{{ formState.serialNo }}</span>
      </div>

      <!-- 服务器地址 -->
      <div class="range-box">
        <span class="range-span">{{ t('device.infoPop.serverAddress') }}</span>
        <span>{{ formState.ip }}</span>
      </div>

      <hr />

      <div v-show="formState.isLink">
        <!-- 温度 范围 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.temperatureRange') }}</span>
            <span class="range-value">{{ formState.temperatureStart }}-{{ formState.temperatureEnd }} ℃</span>
          </div>

          <div class="range-box">
            <span>{{ t('device.infoPop.nowSetValue') }}: {{ formState.showSetTemperature }}</span>
          </div>
        </div>

        <!-- 湿度 范围 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.humidityRange') }}</span>
            <span class="range-value">{{ formState.humidityStart }}-{{ formState.humidityEnd }} %rH</span>
          </div>

          <div class="range-box">
            <span>{{ t('device.infoPop.nowSetValue') }}: {{ formState.showSetHumidity }}</span>
          </div>
        </div>

        <!-- 光照范围 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.beamRange') }}</span>
            <span class="range-value">{{ formState.beamStart }}-{{ formState.beanEnd }} lx</span>
          </div>

          <div class="range-box">
            <span>{{ t('device.infoPop.nowSetValue') }}: {{ formState.showSetBeam }}</span>
          </div>
        </div>

        <hr />

        <!-- 报警方式 -->
        <div class="range-box">
          <span class="range-span">{{ t('device.infoPop.alarmType') }}</span>
          <a-select class="long-input" v-model:value="formState.alarmTypeArr" mode="multiple">
            <a-select-option value="邮件">{{ t('device.infoPop.email') }}</a-select-option>
            <a-select-option value="电话">{{ t('device.infoPop.phone') }}</a-select-option>
            <a-select-option value="短信">{{ t('device.infoPop.message') }}</a-select-option>
          </a-select>
        </div>

        <!-- 是否开启温度 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.isTemperature') }}</span>
            <span class="range-value">
              <a-checkbox v-model:checked="formState.isTemperature"></a-checkbox>
            </span>
          </div>

          <div class="range-box" v-show="formState.isTemperature">
            <span class="set-span">{{ t('device.infoPop.setValue') }}</span>
            <a-input-number class="input-number" :step="0.1" :precision="1" v-model:value="formState.setTemperature" />
          </div>
        </div>

        <!-- 是否开启湿度 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.isHumidity') }}</span>
            <span class="range-value">
              <a-checkbox v-model:checked="formState.isHumidity"></a-checkbox>
            </span>
          </div>

          <div class="range-box" v-show="formState.isHumidity">
            <span class="set-span">{{ t('device.infoPop.setValue') }}</span>
            <a-input-number class="input-number" :step="0.1" :precision="1" v-model:value="formState.setHumidity" />
          </div>
        </div>

        <!-- 是否开启光照 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.isBeam') }}</span>
            <span class="range-value">
              <a-checkbox v-model:checked="formState.isBeam"></a-checkbox>
            </span>
          </div>

          <div class="range-box" v-show="formState.isBeam">
            <span class="set-span">{{ t('device.infoPop.setValue') }}</span>
            <a-input-number class="input-number" :step="0.1" :precision="1" v-model:value="formState.setBeam" />
          </div>
        </div>

        <!-- 是否执行 -->
        <div class="range-wrap">
          <div class="range-box">
            <span class="range-span">{{ t('device.infoPop.isRun') }}</span>
            <span class="range-value">
              <a-checkbox v-model:checked="formState.isRun"></a-checkbox>
            </span>
          </div>
        </div>

      </div>

      <a-row justify="center" class="bottom-btn">
        <a-button v-show="formState.isLink" size="small" @click="savePopup">{{ t('device.infoPop.save') }}</a-button>
        <a-button size="small" @click="hideInfoPopup">{{ t('device.infoPop.close') }}</a-button>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue'
import { deviceEdit } from '../controller.api';
import { message } from 'ant-design-vue';
import { DeviceInfoObj } from '../types';
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: 'InfoPopup',
  emits: ['hideInfoPopup', 'refreshList'],
  setup(_, { emit }) {
    const { t } = useI18n();
    const formState: any = reactive({})

    const showInfoPopup = (obj: DeviceInfoObj) => {
      obj.alarmTypeArr = obj.alarmType ? obj.alarmType.split(',') : [];
      Object.assign(formState, obj);

      formState.showSetTemperature = obj.setTemperature;
      formState.showSetHumidity = obj.setHumidity;
      formState.showSetBeam = obj.setBeam;

      formState.setTemperature = undefined;
      formState.setHumidity = undefined;
      formState.setBeam = undefined;
    }
    
    const hideInfoPopup = () => {
      emit('hideInfoPopup');
    }

    const savePopup = () => {
      const params = {
        id: formState.id,
        defineName: formState.defineName,
        alarmType: formState.alarmTypeArr.join(','),
        setTemperature: formState.setTemperature,
        setHumidity: formState.setHumidity,
        setBeam: formState.setBeam,
        isTemperature: formState.isTemperature,
        isHumidity: formState.isHumidity,
        isBeam: formState.isBeam,
        isRun: formState.isRun
      }
      
      deviceEdit(params).then(() => {
        message.success(t('device.tips.saveSuccess'));
        emit('refreshList');
        hideInfoPopup();
      })
    }

    return {
      t,
      formState,
      leftSpan: 8,
      rightSpan: 16,
      showInfoPopup,
      hideInfoPopup,
      savePopup
    }
  },
})
</script>

<style lang="less" scoped>
.info-wrap {
  width: 550px;
  border: solid 3px #eee;
  // background: @sider-dark-bg-color;
  background-color: #fff;
  border-radius: 5px;

  .title {
    font-size: 25px;
    padding: 0 10px;
    background: linear-gradient(0deg, #666 30%, #333 70%);
  }
  .info-box {
    padding: 10px;
    font-size: 15px;
  }
  .ant-row {
    margin: 5px 0;
  }
  .ant-select,
  .ant-input-number {
    width: 100%;
  }

  .bottom-btn {
    margin-top: 16px;

    .ant-btn {
      margin: 0 8px;
    }
  }

  .range-wrap {
    display: flex;
    align-items: center;
    width: 100%;

  }

  .range-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    // margin: 5px 0;

    .range-span {
      width: 175px;
    }
    .range-value {
      width: 100px;
    }
    .input-number {
      width: 120px;
    }
    .only-show {
      margin-left: 30px;
    }
    .set-span {
      width: 90px;
      margin-right: 5px;
    }
    .long-input {
      width: 315px;
    }
  }
}
</style>
