<template>
  <div class="scheme-box">
    <template v-for="(item, index) in deviceList" :key="item.id">
      <div @click="clickScheme(item)">
        <DeviceItem :infoItem="item" :activeDeviceId="activeDeviceObj.id">
          <i class="iconfont icon-xinxiinfo21 icon-help" @click.stop="showInfoPopup(item, index)"></i>
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
import { getDeviceList } from '../controller.api';
// import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import { getFileAccessHttpUrl } from '@/utils/common/compUtils';
import { useRoute } from 'vue-router';
import { message } from "ant-design-vue";

export default defineComponent({
  name: "ChartSideBar",
  components: {
    DeviceItem,
    InfoPopup
  },
  emits: ['selectDevice'],
  setup(_, { emit }) {
    const route = useRoute();
    const visibleInfo = ref(false);
    const activeDeviceObj = reactive({ id: 1, name: 'HPP 260' }); 
    const deviceList = ref([]);
    const infoPopTop = ref(0);
    const infoPopRef = ref();

    const initDeviceList = () => {
      deviceList.value = [];
      
      getDeviceList().then(data => {
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
        console.log("=== 设备列表: ", data);
      })
    }
    initDeviceList();

    const clickScheme = (item) => {
      if (!item.isLink) {
        return message.warning('该设备不可连接，请联系管理员');
      }
      Object.assign(activeDeviceObj, item);
      console.log("=== sider activeDeviceObj: ", activeDeviceObj);
      
      emit('selectDevice', item);
    }

    const showInfoPopup = (item, index: number) => {
      console.log("== index: ", index);
      // infoPopTop.value = 130 * index;
      visibleInfo.value = true;
      infoPopRef.value.showInfoPopup(item);
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
      clickScheme,
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
  right: -500px;
}
</style>
