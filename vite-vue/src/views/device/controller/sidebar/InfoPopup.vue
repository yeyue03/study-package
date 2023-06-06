<template>
  <div class="info-wrap">
    <div class="title">Info</div>
    <div class="info-box">
      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Device Type</a-col>
        <a-col :span="rightSpan">{{ formState.type }}</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">User Defined Name</a-col>
        <a-col :span="rightSpan">
          <a-input v-model:value="formState.defineName"></a-input>
        </a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Serial No</a-col>
        <a-col :span="rightSpan">{{ formState.serialNo }}</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Server Address</a-col>
        <a-col :span="rightSpan">{{ formState.ip }}</a-col>
      </a-row>

      <hr />

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Temperature Range</a-col>
        <a-col :span="rightSpan">{{ formState.temperatureStart }}-{{ formState.temperatureEnd }} ℃</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Humidity Range</a-col>
        <a-col :span="rightSpan">{{ formState.humidityStart }}-{{ formState.humidityEnd }} %rH</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Beam Range</a-col>
        <a-col :span="rightSpan">{{ formState.beamStart }}-{{ formState.beanEnd }} lx</a-col>
      </a-row>

      <hr />

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">报警方式</a-col>
        <a-col :span="rightSpan">
          <a-select v-model:value="formState.alarmType">
            <a-select-option value="邮件">邮件</a-select-option>
            <a-select-option value="电话">电话</a-select-option>
            <a-select-option value="短信">短信</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">温度设定值</a-col>
        <a-col :span="rightSpan">
          <a-input-number class="tag-span" :min="1" :max="1440" :step="1" :precision="0" v-model:value="formState.temperature" />
        </a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">湿度设定值</a-col>
        <a-col :span="rightSpan">
          <a-input-number class="tag-span" :min="1" :max="1440" :step="1" :precision="0" v-model:value="formState.humidity" />
        </a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">光照设定值</a-col>
        <a-col :span="rightSpan">
          <a-input-number class="tag-span" :min="1" :max="1440" :step="1" :precision="0" v-model:value="formState.beam" />
        </a-col>
      </a-row>

      <a-row justify="center" class="bottom-btn">
        <a-button size="small" @click="savePopup">Save</a-button>
        <a-button size="small" @click="hideInfoPopup">Close</a-button>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue'
import { deviceEdit } from '../controller.api';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'InfoPopup',
  emits: ['hideInfoPopup', 'refreshList'],
  setup(_, { emit }) {
    const formState = reactive({})

    const showInfoPopup = (obj) => {
      Object.assign(formState, obj);
    }
    
    const hideInfoPopup = () => {
      emit('hideInfoPopup');
    }

    const savePopup = () => {
      const params = {
        id: formState.id,
        defineName: formState.defineName,
        alarmType: formState.alarmType
      }
      deviceEdit(params).then(res => {
        emit('refreshList');
      })
    }

    return {
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
  width: 500px;
  border: solid 3px #eee;
  background: @sider-dark-bg-color;
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
}
</style>
