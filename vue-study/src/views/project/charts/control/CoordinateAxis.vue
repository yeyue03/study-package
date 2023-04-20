<template>
  <div class="axis-wrap">
    <div class="tag-box">
      <span class="tag-span">Ramp {{ formState.index }}</span>
      <span v-if="!formState.isShowTimeInput" class="tag-span" @click="showTimeInput">{{ durationConvertStr }}</span>
      <a-input-number v-else class="tag-span" :min="1" :max="1440" :step="1" :precision="0" :autofocus="true" v-model:value="formState.duration" @blur="showTimeInput" />
    </div>

    <div class="canvas-box" :style="canvasStyle">
      <canvas ref="canvasRef">
        您的浏览器不支持canvas
      </canvas>

      <div class="icon-float">
        <i :class="`iconfont ${formState.icon}`"></i>
      </div>
    </div>

    <div class="tag-box">
      <span class="tag-span">{{ formState.startValue }}</span>
      <a-input-number class="tag-span" :min="1" :max="70" :step="1" :precision="0" v-model:value="formState.endValue" @change="changeValue" />
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, nextTick, reactive, toRefs, computed } from "vue";

export default defineComponent({
  name: "CoordinateAxis",
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
  emits: ['changeAxis'],
  setup(props, { emit }) {
    const { canvasWidth, canvasHeight, axisObj } = toRefs(props); // 获取画布的宽、高

    const formState = reactive({
      ...axisObj.value
    });

    const durationConvertStr = computed(() => {
      const hour = Math.floor(formState.duration / 60);
      let minute = formState.duration % 60;
      minute = minute < 10 ? '0' + minute : minute;
      return hour + 'h:' + minute + 'm';
    })

    const canvasRef = ref();
    let ctx = null;
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
      changeAxis();
    }

    const changeAxis = () => {
      emit('changeAxis', formState);
    }

    return {
      canvasRef,
      formState,
      durationConvertStr,
      canvasStyle: {
        width: canvasWidth.value + 'px',
        height: canvasHeight.value + 'px',
        'border-color': '#f5f5f5'
      },
      changeValue,
      showTimeInput,
    };
  },
});
</script>

<style lang="less" scopede>
.axis-wrap {
  width: 210px;
  padding: 0 5px 0 0;
  background: #333;
}
.canvas-box {
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
}
.tag-box {
  width: 100%;
  height: 52px;
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
</style>
