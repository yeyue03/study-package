<template>
  <div class="axis-wrap">
    <div class="tag-box">
      <span class="tag-span">Ramp 01</span>
      <span class="tag-span">1h:00m</span>
    </div>

    <div class="canvas-box">
      <canvas
        ref="canvasRef"
        width="205"
        height="110"
        style="border-color: #f5f5f5"
      >
        您的浏览器不支持canvas
      </canvas>
    </div>

    <div class="tag-box">
      <span class="tag-span">{{ formState.startValue }}</span>
      <a-input-number class="tag-span" :min="1" :max="70" :step="1" :precision="0" v-model:value="formState.endValue" @change="changeValue" />
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, nextTick, reactive } from "vue";

export default defineComponent({
  name: "CoordinateAxis",
  setup() {
    const formState = reactive({
      startValue: 10,
      endValue: 20,
    });

    const canvasRef = ref();
    let ctx = null;
    const canvasWidth = 205; // 获取画布的宽度
    const canvasHeight = 110; // 获取画布的高度
    const gridSpace = 10; // 网格线间隔 px
    const axisSpace = 10; // 坐标轴留白 px
    const xLineNumber = Math.floor(canvasWidth / gridSpace) + 1; // 计算需要几条竖线
    const yLineNumber = Math.floor(canvasHeight / gridSpace) - 1; // 计算需要几条横线

    nextTick(() => {
      ctx = canvasRef.value.getContext("2d");
      setCanvas();
    });

    const setCanvas = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.strokeStyle = "#ccc";
      for (let i = 2; i < xLineNumber; i++) {
        // 循环画竖线 边界不要线，所以i从2开始
        ctx.beginPath();
        ctx.moveTo(i * gridSpace, gridSpace);
        ctx.lineTo(i * gridSpace, canvasHeight - axisSpace);
        ctx.stroke();
      }
      for (let i = 2; i < yLineNumber; i++) {
        // 循环画横线
        ctx.beginPath();
        ctx.moveTo(gridSpace, i * gridSpace);
        ctx.lineTo(canvasWidth, i * gridSpace);
        ctx.stroke();
      }

      ctx.strokeStyle = "black";
      // 绘制X轴
      ctx.beginPath();
      ctx.moveTo(axisSpace, canvasHeight - axisSpace);
      ctx.lineTo(canvasWidth - axisSpace, canvasHeight - axisSpace);
      ctx.stroke();

      // 绘制Y轴
      ctx.beginPath();
      ctx.moveTo(axisSpace, axisSpace);
      ctx.lineTo(axisSpace, canvasHeight - axisSpace);
      ctx.stroke();

      // 绘制X轴的箭头
      ctx.moveTo(canvasWidth - axisSpace, canvasHeight - axisSpace - 5);
      ctx.lineTo(canvasWidth - axisSpace, canvasHeight - axisSpace + 5);
      ctx.lineTo(canvasWidth - axisSpace + 10, canvasHeight - axisSpace);
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
      ctx.moveTo(axisSpace, canvasHeight - axisSpace - formState.startValue);
      ctx.lineTo(canvasWidth, canvasHeight - axisSpace - formState.endValue);
      ctx.strokeStyle = "#0080FF";
      ctx.stroke();
    };

    const changeValue = () => {
      setCanvas();
    };

    return {
      canvasRef,
      formState,
      changeValue,
    };
  },
});
</script>

<style lang="less" scopede>
.axis-wrap {
  width: 205px;
  height: 450px;
}
.canvas-box {
  width: 220px;
  height: 230px;
  background: #eee;
}
.tag-box {
  width: 100%;
  padding: 10px 0;
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
