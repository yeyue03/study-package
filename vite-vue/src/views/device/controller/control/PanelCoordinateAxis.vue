<template>
  <div :class="{'board': true, 'band-board': formState.isShowBand}">
    <div class="axis-wrap">
      <div class="tag-box">
        <span class="tag-span">Ramp {{ formState.serialNumber }}</span>
        <span v-if="!formState.isShowTimeInput" class="tag-span" @click="showTimeInput">{{ durationConvertStr }}</span>
        <template v-else>
          <template v-if="formState.valueType == 'range'">
            <a-select v-model:value="formState.powerSize" defaultOpen autofocus @change="showTimeInput" @blur="showTimeInput">
              <a-select-option value="1">功率1</a-select-option>
              <a-select-option value="2">功率2</a-select-option>
            </a-select>
          </template>
          <template v-else>
            <a-input-number class="tag-span" :min="1" :max="1440" :step="1" :precision="0" v-focus v-model:value="formState.duration" @blur="showTimeInput" />
          </template>
        </template>
      </div>

      <!-- 坐标轴画布 -->
      <div class="canvas-box" :style="canvasStyle">
        <canvas ref="canvasRef">
          您的浏览器不支持canvas
        </canvas>

        <div class="icon-float">
          <i :class="`iconfont ${formState.icon}`"></i>
        </div>
      </div>

      <div class="tag-box">
        <!-- startValue 输入框 -->
        <template v-if="!formState.isShowStartValInput">
          <span v-if="formState.valueType == 'range'" class="tag-span" @click="showValueInput('isShowStartValInput')">{{ formState.startValue }} {{ panelTypeSymboObj[formState.panelType] }}</span>
          <span v-else class="tag-span"></span>
        </template>
        <template v-else>
          <a-input-number class="tag-span" :min="valueMin" :max="valueMax" :step="1" :precision="0" v-focus v-model:value="formState.startValue" @blur="showValueInput('isShowStartValInput')" />
        </template>

        <!-- endValue 输入框 -->
        <span v-if="!formState.isShowEndValInput" class="tag-span" @click="showValueInput('isShowEndValInput')">{{ formState.endValue }} {{ panelTypeSymboObj[formState.panelType] }}</span>
        <template v-else>
          <a-input-number class="tag-span" :min="valueMin" :max="valueMax" :step="1" :precision="0" v-focus v-model:value="formState.endValue" @blur="showValueInput('isShowEndValInput')" />
        </template>
      </div>
      
    </div>

    <!-- 方差 -->
    <div class="arrow-box" @click="showBand">
      <i :class="`iconfont ${formState.isShowBand ? 'icon-zuojiantou' : 'icon-youjiantou'}`"></i>
    </div>
    <div v-if="formState.isShowBand" class="band-box">
      <div class="tag-box">
        <span class="tag-span">Tol. band</span>
      </div>
      <div class="band-span">
        <div>
          <span class="max-span">max: </span>
          <span v-if="!formState.isShowMaxBandInput" @click="showBandInput('isShowMaxBandInput')">{{ formState.bandMax }}  {{ panelTypeSymboObj[formState.panelType] }}</span>
          <a-input-number v-else class="tag-input" :min="0" :max="100" :step="1" :precision="0" v-focus v-model:value="formState.bandMax" @blur="showBandInput('isShowMaxBandInput')" />
        </div>
        <div>
          <span class="max-span">min: </span>
          <span v-if="!formState.isShowMinBandInput" @click="showBandInput('isShowMinBandInput')">{{ formState.bandMin }}  {{ panelTypeSymboObj[formState.panelType] }}</span>
          <a-input-number v-else class="tag-input" :min="-100" :max="0" :step="1" :precision="0" v-focus v-model:value="formState.bandMin" @blur="showBandInput('isShowMinBandInput')" />
        </div>
      </div>
      <div class="radio-wrap">
        <span class="tag-span">SPWT</span>
        <div class="radio-box">
          <div class="radio-label" @click="selectSpwt(true)">
            <span>On</span>
            <span :class="{'circle': true, 'circle-active': formState.isSpwt}"></span>
          </div>
          <div class="radio-label" @click="selectSpwt(false)">
            <span>Off</span>
            <span :class="{'circle': true, 'circle-active': !formState.isSpwt}"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, nextTick, reactive, toRefs, watch, computed, inject } from "vue";

export default defineComponent({
  name: "PanelCoordinateAxis",
  props: {
    canvasWidth: {
      type: Number,
      default: () => {
        return 205;
      }
    },
    canvasHeight: {
      type: Number,
      default: () => {
        return 110;
      }
    },
    axisObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  emits: ['changePanel'],
  setup(props, { emit }) {
    const { canvasWidth, canvasHeight, axisObj } = toRefs(props); // 获取画布的宽、高

    const formState = reactive({
      ...axisObj.value
    });
    watch(axisObj, (newObj) => {
      Object.assign(formState, newObj)
    }, {
      deep: true
    })

    const panelTypeSymboObj = reactive({
      temperature: '℃',
      humidity: '%rh',
      beam: 'lx',
    })

    const durationConvertStr = computed(() => {
      if (formState.valueType == 'constant') {
        const hour = Math.floor(formState.duration / 60);
        let minute: number | string = formState.duration % 60;
        minute = minute < 10 ? '0' + minute : minute;
        return hour + 'h:' + minute + 'm';

      } else { // 显示功率
        return '功率' + formState.powerSize
      }
    })

    const injectDeviceObj: any = inject("changeDeviceObj", {});
    const valueMin = computed(() => {
      let min = 1;
      if (formState.panelType == 'temperature') {
        min = injectDeviceObj.value?.temperatureStart;
      } else if (formState.panelType == 'humidity') {
        min = injectDeviceObj.value?.humidityStart;
      } else if (formState.panelType == 'beam') {
        min = injectDeviceObj.value?.beamStart;
      }

      return min || 1;
    })

    const valueMax = computed(() => {
      let max = 100;
      if (formState.panelType == 'temperature') {
        max = injectDeviceObj.value?.temperatureEnd;
      } else if (formState.panelType == 'humidity') {
        max = injectDeviceObj.value?.humidityEnd;
      } else if (formState.panelType == 'beam') {
        max = injectDeviceObj.value?.beanEnd;
      }

      return max || 100;
    })

    const canvasRef = ref();
    let ctx: any = null;
    const gridSpace = 10; // 网格线间隔 px
    const axisSpace = 10; // 坐标轴留白 px
    const xLineNumber = Math.floor(canvasWidth.value / gridSpace) + 1; // 计算需要几条竖线
    const yLineNumber = Math.floor(canvasHeight.value / gridSpace) - 1; // 计算需要几条横线

    nextTick(() => {
      ctx = canvasRef.value.getContext("2d");
      // ctx.canvas.style.width = canvasWidth.value + 'px';
      // ctx.canvas.style.height = canvasHeight.value + 'px';
      ctx.width = canvasWidth.value;
      ctx.height = canvasHeight.value;
      setCanvas();
    });

    // 绘制画布
    const setCanvas = () => {
      ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
      
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#777";
      for (let i = 2; i < xLineNumber; i++) {
        // 循环画竖线 边界不要线，所以i从2开始
        ctx.beginPath();
        ctx.moveTo(i * gridSpace, gridSpace);
        ctx.lineTo(i * gridSpace, canvasHeight.value - axisSpace);
        ctx.stroke();
      }
      for (let i = 2; i < yLineNumber; i++) {
        // 循环画横线
        ctx.beginPath();
        ctx.moveTo(gridSpace, i * gridSpace);
        ctx.lineTo(canvasWidth.value, i * gridSpace);
        ctx.stroke();
      }

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      // 绘制X轴
      ctx.beginPath();
      ctx.moveTo(axisSpace, canvasHeight.value - axisSpace);
      ctx.lineTo(canvasWidth.value - axisSpace, canvasHeight.value - axisSpace);
      ctx.stroke();

      // 绘制Y轴
      ctx.beginPath();
      ctx.moveTo(axisSpace, axisSpace);
      ctx.lineTo(axisSpace, canvasHeight.value - axisSpace);
      ctx.stroke();

      // 绘制X轴的箭头
      ctx.fillStyle = '#fff'
      ctx.moveTo(canvasWidth.value - axisSpace, canvasHeight.value - axisSpace - 5);
      ctx.lineTo(canvasWidth.value - axisSpace, canvasHeight.value - axisSpace + 5);
      ctx.lineTo(canvasWidth.value - axisSpace + 10, canvasHeight.value - axisSpace);
      ctx.closePath();
      ctx.fill();

      // 绘制Y轴箭头
      ctx.moveTo(axisSpace - 5, axisSpace);
      ctx.lineTo(axisSpace + 5, axisSpace);
      ctx.lineTo(axisSpace, axisSpace - 10);
      ctx.closePath();
      ctx.fill();

      // 绘制直线
      ctx.beginPath();
      ctx.moveTo(axisSpace, canvasHeight.value - axisSpace - formState.startValue);
      ctx.lineTo(canvasWidth.value, canvasHeight.value - axisSpace - formState.endValue);
      ctx.strokeStyle = "#0080FF";
      ctx.stroke();
    };

    const changeValue = () => {
      if (formState.valueType == 'constant') {
        formState.startValue = formState.endValue;
      }
      setCanvas();
      changeAxis();
    };

    // 是否显示时间段输入框
    const showTimeInput = () => {
      formState.isShowTimeInput = !formState.isShowTimeInput;
      if (!formState.isShowTimeInput) {
        changeAxis();
      }
    }

    // 是否显示开始/结束 value 输入框
    const showValueInput = (keyStr: string) => {
      formState[keyStr] = !formState[keyStr];
      if (!formState[keyStr]) {
        changeValue();
      }
    }

    // 是否显示方差box
    const showBand = () => {
      formState.isShowBand = !formState.isShowBand;
    }

    // 是否显示方差输入框
    const showBandInput = (key: string) => {
      formState[key] = !formState[key];
      if (!formState[key]) {
        changeAxis();
      }
    }

    // SPWT 是否on
    const selectSpwt = (bool: boolean) => {
      formState.isSpwt = bool;
      changeAxis();
    }

    // 变更数据
    const changeAxis = () => {
      emit('changePanel', formState);
    }

    return {
      canvasRef,
      formState,
      panelTypeSymboObj,
      durationConvertStr,
      canvasStyle: {
        width: canvasWidth.value + 'px',
        height: canvasHeight.value + 'px',
        'border-color': '#f5f5f5'
      },
      valueMax,
      valueMin,
      changeValue,
      showTimeInput,
      showValueInput,
      showBand,
      showBandInput,
      selectSpwt
    };
  },
  directives: {
    focus: {
      mounted: (el: any) => el.querySelector("input").focus()
    }
  }
});
</script>

<style lang="less" scoped>
@rowHeight: 214px;
@boardBgColor: #333;

.board {
  display: flex;
  height: @rowHeight !important;
}
.band-board {
  width: 330px !important;
}
.axis-wrap {
  overflow: hidden;
  width: 210px;
  height: 100%;
  padding: 0 5px 0 0;
  background: #333;
}
.canvas-box {
  overflow: hidden;
  position: relative;
  width: 220px;
  height: 230px;
}
.icon-float {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .iconfont {
    font-size: 45px;
    color: red;
  }
  .icon-shidu {
    color: skyblue;
  }
  .icon-guangzhao {
    color: #ffff00;
  }
}
.tag-box {
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .tag-span {
    width: 80px;
    text-align: center;
  }
  .ant-input-number-input {
    text-align: center;
  }
}

// 方差
.arrow-box {
  position: absolute;
  top: 80px;
  right: -15px;
  width: 15px;
  color: #333;
  background: #aaa;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  cursor: pointer;
}
.band-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 120px;
  padding: 0 10px;
  color: #fff;
  background: @boardBgColor;
  box-sizing: border-box;
  border-left: solid 3px #ccc;
  
  .band-span {
    display: flex;
    flex-direction: column;
  }
  .max-span {
    display: inline-block;
    width: 34px;
  }
  .tag-input {
    width: 60px;
  }
  .radio-wrap {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .radio-box {
    display: flex;
  }
  .radio-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30px;
    cursor: pointer;
  }
  .circle {
    width: 10px;
    height: 10px;
    margin-top: 5px;
    background: #000;
    border: solid 2px #fff;
    border-radius: 50%;
  }
  .circle-active {
    background: #ffcc22;
  }
  .ant-radio-wrapper{
    color: #fff;
  }
}
</style>
