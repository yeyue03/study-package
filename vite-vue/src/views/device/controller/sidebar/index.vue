<template>
  <div class="scheme-box">
    <template v-for="(item, index) in deviceList" :key="item.id">
      <div :class="{'item-border': true, 'width-99': isShowTwoCol}" @click="clickScheme(item)">
        <div :class="{'item-box': true, 'active-box': item.id == activeDeviceObj.id}">
          <span class="serial-no" title="item.serialNo">{{ item.serialNo }}</span>
          <span class="serial-no" title="item.defineName">{{ item.defineName }}</span>
          <a-row class="img-box" type="flex" align="bottom" justify="space-between">
            <a-row>
              <img class="img-left" :src="item.url" />

              <div class="icon-box">
                <div class="icon-box-left">
                  <i v-if="item.isTemperature" class="iconfont icon-wendu"></i>
                  <i v-if="item.isHumidity" class="iconfont icon-shidu"></i>
                </div>
                <i v-if="!item.isLink" class="iconfont icon-cha"></i>
              </div>
            </a-row>

            <div class="right-box">
              <i v-if="item.alarmType == '邮件'" class="iconfont icon-youxiang icon-yujin"></i>
              <i v-else-if="item.alarmType == '电话'" class="iconfont icon-shouji icon-yujin"></i>
              <i v-else-if="item.alarmType == '短信'" class="iconfont icon-duanxin_o icon-yujin"></i>
              <span v-else></span>
              <i class="iconfont icon-xinxiinfo21 icon-help" @click.stop="showInfoPopup(item, index)"></i>
            </div>
          </a-row>
        </div>
      </div>
    </template>

  </div>
  <div class="tow-col" @click="showTwoCol">《</div>

  <div v-show="visibleInfo" class="info-popup" :style="`top: ${infoPopTop}px`">
    <InfoPopup ref="infoPopRef" @hideInfoPopup="hideInfoPopup" @refreshList="initDeviceList" />
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import InfoPopup from './InfoPopup.vue';
import { getDeviceList } from '../controller.api';
// import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import { getFileAccessHttpUrl } from '@/utils/common/compUtils';
import { useRoute } from 'vue-router';
import { message } from "ant-design-vue";

export default defineComponent({
  name: "ChartSideBar",
  components: {
    InfoPopup
  },
  emits: ['selectDevice'],
  setup(_, { emit }) {
    const route = useRoute();
    const visibleInfo = ref(false);
    const activeDeviceObj = reactive({ id: 1, name: 'HPP 260' }); 
    const deviceList = ref([]);
    const infoPopTop = ref(0);
    const isShowTwoCol = ref(false);
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

    const showTwoCol = () => {
      isShowTwoCol.value = !isShowTwoCol.value;
    }

    return {
      visibleInfo,
      infoPopTop,
      infoPopRef,
      deviceList,
      activeDeviceObj,
      isShowTwoCol,
      initDeviceList,
      clickScheme,
      showInfoPopup,
      hideInfoPopup,
      showTwoCol
    };
  },
});
</script>

<style lang="less" scoped>
.scheme-box {
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.scheme-box::-webkit-scrollbar {
  display: none;
}
.item-border {
  // width: 100%;
  width: 200px;
  height: 130px;
  padding: 5px;
  box-sizing: border-box;
  background: @sider-dark-bg-color;
  border: solid 1px #ccc;
}
.item-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 5px;
  border: solid 3px transparent;
  box-sizing: border-box;
  border-radius: 5px;

  .serial-no {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .img-left {
    width: 55px;
    height: auto;
    margin-right: 5px;
  }

  .icon-box {
    display: flex;
    align-items: flex-end;
    font-size: 16px;
    .icon-cha {
      color: #f00;
    }
  }
  .icon-box-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 5px;
  }
  .icon-wendu {
    font-size: 20px;
  }
  .icon-yujin {
    font-size: 20px;
  }
  .icon-help {
    width: 25px;
    height: 25px;
    font-size: 16px;
    text-align: center;
    color: #333;
    background: #eee;
    cursor: pointer;
  }
  .right-box {
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: space-between;
  }
}
.active-box {
  border: solid 3px yellow !important;
}

.info-popup {
  position: absolute;
  top: -5px;
  // left: 190px;
  right: -500px;
}

.tow-col {
  position: absolute;
  left: 200px;
  top: 0;
  background: #333;
  cursor: pointer;
}
.width-99 {
  width: 99px;
}
</style>
