<template>
  <div class="item-border">
    <div :class="{'item-box': true, 'active-box': infoItem.id == activeDeviceId}">
      <div class="left-box">
        <div>
          <span class="serial-no" :title="infoItem.serialNo">{{ infoItem.serialNo }}</span>
          <span class="serial-no" :title="infoItem.defineName">{{ infoItem.defineName }}</span>
        </div>

        <a-row class="img-box" type="flex" align="bottom" justify="space-between">
          <a-row>
            <img class="img-left" :src="infoItem.url" />

            <div class="panel-type">
              <div v-if="infoItem.isTemperature" class="panel-type-item">
                <i class="iconfont icon-wendu"></i>
                <span>{{ infoItem.temperature }} ℃</span>
              </div>
              <div v-if="infoItem.isHumidity" class="panel-type-item">
                <i class="iconfont icon-shidu"></i>
                <span>{{ infoItem.humidity }} %rh</span>
              </div>
              <div v-if="infoItem.isBeam" class="panel-type-item">
                <i class="iconfont icon-guangzhao"></i>
                <span>{{ infoItem.beam }} lx</span>
              </div>
            </div>
          </a-row>
          
        </a-row>
      </div>

      <div class="right-box">
        <i v-if="!infoItem.isLink" class="iconfont icon-cha"></i>
        <i v-if="infoItem.alarmType.indexOf('邮件') != -1" class="iconfont icon-youxiang icon-yujin"></i>
        <i v-if="infoItem.alarmType.indexOf('电话') != -1" class="iconfont icon-shouji icon-yujin"></i>
        <i v-if="infoItem.alarmType.indexOf('短信') != -1" class="iconfont icon-duanxin_o icon-yujin"></i>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/** *******
 * 该组件同步在首页、设备控制页面使用，改动时需谨慎检查俩页面
 */
export default defineComponent({
  name: 'DeviceItem',
  props: {
    infoItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    activeDeviceId: {
      type: [Number, String],
      default: () => {
        return ''
      }
    },
  },
  setup() {
    
    return {}
  },
})
</script>

<style lang="less" scoped>
.item-border {
  // width: 100%;
  width: 200px;
  height: 150px;
  padding: 5px;
  box-sizing: border-box;
  background: @sider-dark-bg-color;
  border: solid 1px #ccc;
}
.item-box {
  position: relative;
  display: flex;
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
    word-break: break-all;
  }

  .img-left {
    width: 55px;
    height: 60px;
    margin-right: 5px;
  }

  .panel-type {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    font-size: 16px;
  }
  .panel-type-item {
    font-size: 14px;
    line-height: 20px;
    .iconfont {
      font-size: 14px;
      margin-right: 6px;
    }
  }
}
.left-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.right-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  .iconfont {
    font-size: 15px;
  }
  .icon-cha {
    font-size: 14px;
    color: #f00;
  }
}

.active-box {
  border: solid 3px yellow !important;
}
</style>
