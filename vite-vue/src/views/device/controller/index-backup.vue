<template>
  <div class="fda-device-content context-box" :style="`height: ${boxHeight}px;`">
    <div class="sidebar-wrap">
      <Sidebar @selectDevice="selectDevice" />
    </div>

    <div class="main-wrap">
      <TopBar :pageName="pageName" @changePageName="changePageName" />

      <div class="placeholder-wrap">
        <div :class="{ placeholder: true, 'absolute-box': pageName != 'Editor' }">
          <ControlRoom />
        </div>

        <div :class="{ placeholder: true, 'absolute-box': pageName != 'Protocol' }">
          <ChartPanel pageName="Protocol" />
        </div>

        <div :class="{ placeholder: true, 'absolute-box': pageName != 'Simulation' }">
          <ChartPanel pageName="Simulation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, provide, defineComponent } from 'vue';
import Sidebar from './sidebar/index.vue';
import TopBar from './topBar/index.vue';
import ControlRoom from './control/index.vue';
import ChartPanel from './chartPanel/index.vue';
import { planDetal } from './controller.api';
import { listenerPlanDetailRefresh, setStandardType } from './useMitt';
import type { DeviceInfoObj } from './types';

export default defineComponent({
  name: 'ProjectCharts',
  components: {
    Sidebar,
    TopBar,
    ControlRoom,
    ChartPanel,
  },
  setup() {
    const pageName = ref('Protocol');
    const deviceObj = ref();
    const planDetailObj = ref({});
    let boxHeight = document.body.clientHeight - 99;
    boxHeight = boxHeight < 640 ? 640 : boxHeight;
    const needPanelRowList = ref(['temperature', 'humidity', 'beam']); // 该设备含有的面板类似 温度、湿度、光照

    provide('changeDeviceObj', deviceObj);
    provide('changePageName', pageName);
    provide('changeDevicePlanDetail', planDetailObj);
    provide('changePanelRowList', needPanelRowList);

    const changePageName = (name: string) => {
      pageName.value = name;
    };

    const selectDevice = (obj: DeviceInfoObj) => {
      deviceObj.value = obj;
      getPlanDetail(obj?.id);
      setPanelRowList(obj);
    };

    const setPanelRowList = (obj: DeviceInfoObj) => {
      let _arr: any = [];
      if (obj?.isTemperature) {
        _arr.push('temperature');
      }
      if (obj?.isHumidity) {
        _arr.push('humidity');
      }
      if (obj?.isBeam) {
        _arr.push('beam');
      }
      needPanelRowList.value = _arr;
    };

    // 获取设备计划详情
    const getPlanDetail = (deviceId: number) => {
      planDetailObj.value = {};
      if (!deviceId) {
        return;
      }

      // detailLoading.value = true;
      const params = {
        deviceId,
      };
      planDetal(params).then((res: any) => {
        if (res) {
          planDetailObj.value = res;
          setStandardType(res.standardType);
        }
      });
    };

    // 刷新详情
    listenerPlanDetailRefresh(() => {
      if (deviceObj?.value && deviceObj.value?.id) {
        getPlanDetail(deviceObj.value?.id);
      }
    });

    return {
      pageName,
      boxHeight,
      selectDevice,
      changePageName,
      deviceObj,
    };
  },
});
</script>

<style lang="less" scoped>
.context-box {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  // color: #fff;
}
.sidebar-wrap {
  z-index: 20;
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  min-width: 200px;
  height: 100%;
  background: #999;
  border: solid 1px #eee;
}
.main-wrap {
  width: 100%;
  height: 100%;
  padding-left: 200px;
  position: relative;
  // background: @sider-dark-bg-color;
  background-color: #fff;
  box-sizing: border-box;

  .placeholder-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .absolute-box {
    position: absolute;
    top: -2000px;
    right: 2000px;
  }
}
</style>

<style lang="less">
@dark-bg: #151515;
@boardBgColor: #333;

.fda-device-content {
  // settings 板块
  .axis-wrap,
  .band-box,
  .loop-box,
  .clock-timer,
  .standard-box {
    color: #fff;
    background-color: @dark-bg;
  }
}

html[data-theme='dark'] {
  .fda-device-content {
    background-color: @dark-bg !important;

    .main-wrap {
      background-color: @dark-bg !important;
    }

    .item-border {
      background-color: @dark-bg;
    }
    .info-wrap {
      background-color: @dark-bg !important;
    }
    .option-box .option-item {
      background-color: @dark-bg !important;
    }

    // 顶部按钮
    .nav-box .active {
      background-color: @dark-bg !important;
    }
  }
}
</style>