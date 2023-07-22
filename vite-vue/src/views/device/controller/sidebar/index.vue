<template>
  <div class="scheme-box">
    <template v-for="item in deviceList" :key="item.id">
      <div @click="clickDevice(item)">
        <DeviceItem :infoItem="item" :activeDeviceId="activeDeviceObj.id">
          <i class="iconfont icon-xinxiinfo21 icon-help" @click.stop="showInfoPopup(item)"></i>
        </DeviceItem>
      </div>
    </template>
  </div>

  <div v-show="visibleInfo" class="info-popup" :style="`top: ${infoPopTop}px`">
    <InfoPopup ref="infoPopRef" @hideInfoPopup="hideInfoPopup" @refreshList="initDeviceList" />
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import DeviceItem from './DeviceItem.vue';
import InfoPopup from './InfoPopup.vue';
import { getDeviceList, getDeviceRealValue } from '../controller.api';
import { getFileAccessHttpUrl } from '@/utils/common/compUtils';
import { useRoute } from 'vue-router';
import { message } from "ant-design-vue";
import { DeviceInfoObj } from '../types';
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: "ChartSideBar",
  components: {
    DeviceItem,
    InfoPopup
  },
  emits: ['selectDevice'],
  setup(_, { emit }) {
    const { t } = useI18n();
    const route = useRoute();
    const visibleInfo = ref(false);
    const activeDeviceObj = reactive({ id: 1, name: 'HPP 260' }); 
    const deviceList: any = ref([]);
    const infoPopTop = ref(0);
    const infoPopRef = ref();

    // 获取设备列表
    const initDeviceList = () => {
      deviceList.value = [];
      
      getDeviceList().then((data: any) => {
        if (data && data.length) {
          const queryDeviceId = route.query?.id;
          let defaultDevice = null;
          for (const item of data) {
            item.url = getFileAccessHttpUrl(item.url);
            if (item.isLink && !defaultDevice) {
              defaultDevice = item;
            }

            if (queryDeviceId && queryDeviceId == item.id) {
              defaultDevice = item;
            }
          }

          if (defaultDevice) {
            Object.assign(activeDeviceObj, defaultDevice);
            emit('selectDevice', defaultDevice);
          }
        }
        deviceList.value = data || [];

        loopDeviceListRealValue();
      })

      setTimeout(() => {
        console.log("== 给设备列表赋值");
        deviceList.value = [{
          id: 1,
          ip: '10.24.175.52',
          port: '8080',
          type: 'type',
          serialNo: 'NSSED001',
          defineName: '自定义设备名称自定义设备名称',
          url: '/test',
          alarmType: '电话', // 报警类型
          isTemperature: true, // 是否有温度
          temperatureStart: 5,
          temperatureEnd: 70,
          isHumidity: true, // 是否有湿度
          humidityStart: 10,
          humidityEnd: 60,
          isBeam: true, // 是否有光照
          beamStart: 12,
          beanEnd: 72,
          isLink: true, // 是否链接
        },
        {
          id: 2,
          ip: '10.24.175.52',
          port: '8080',
          type: 'type',
          serialNo: 'sdfdf02',
          defineName: '设备名称',
          url: '/test',
          alarmType: '邮件', // 报警类型
          isTemperature: true, // 是否有温度
          temperatureStart: 5,
          temperatureEnd: 68,
          isHumidity: true, // 是否有湿度
          humidityStart: 15,
          humidityEnd: 65,
          isBeam: true, // 是否有光照
          beamStart: 10,
          beanEnd: 72,
          isLink: true, // 是否链接
        }]
        
      }, 3000);
    }
    initDeviceList();

    // 获取设备当前值、设定值
    const getDeviceNewValue = (item: DeviceInfoObj) => {
      const params = {
        deviceId: item.id
      }
      getDeviceRealValue(params).then((res: any) => {
        item.temperature = res?.temperature || 0;
        item.humidity = res?.humidity || 0;
        item.beam = res?.beam || 0;
        item.setTemperature = res?.setTemperature || 0;
        item.setHumidity = res?.setHumidity || 0;
        item.setBeam = res?.setBeam || 0;
      })
    }

    // 循环设备列表 赋值当前值、设定值
    const loopDeviceListRealValue = () => {
      const decList = deviceList.value;
      if (decList && decList.length) {
        for (const item of decList) {
          getDeviceNewValue(item);
        }
      }
    }

    const clickDevice = (item: DeviceInfoObj) => {
      if (!item.isLink) {
        return message.warning(t('device.tips.deviceNotLink'));
      }
      
      Object.assign(activeDeviceObj, item);
      emit('selectDevice', item);
    }

    let oldSelectDeviceId: number = -1;
    const showInfoPopup = (item: DeviceInfoObj) => {
      if (oldSelectDeviceId == item.id) {
        if (visibleInfo.value) {
          visibleInfo.value = false;
        } else {
          infoPopRef.value.showInfoPopup(item);
          visibleInfo.value = true;
        }

      } else {
        oldSelectDeviceId = item.id;
        visibleInfo.value = true;
        infoPopRef.value.showInfoPopup(item);
      }
    }

    const hideInfoPopup = () => {
      visibleInfo.value = false;
    }

    return {
      visibleInfo,
      infoPopTop,
      infoPopRef,
      deviceList,
      activeDeviceObj,
      initDeviceList,
      clickDevice,
      showInfoPopup,
      hideInfoPopup,
    };
  },
});
</script>

<style lang="less" scoped>
.scheme-box {
  position: relative;
  overflow-y: auto;
  width: 100%;
  height: 100%;
}
.scheme-box::-webkit-scrollbar {
  display: none;
}

.icon-help {
  width: 20px;
  height: 20px;
  font-size: 14px;
  text-align: center;
  color: #333;
  background: #eee;
  cursor: pointer;
}

.info-popup {
  position: absolute;
  top: -5px;
  // left: 190px;
  right: -550px;
}
</style>
