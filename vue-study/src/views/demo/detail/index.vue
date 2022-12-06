<template>
  <div class="detail">
    <HTitle>
      <span>表单1 - 栅格布局</span>
      <template v-slot:dec>
        rules校验直接写form-item上，校验成功失败由finish、onFinishFailed判断
      </template>
    </HTitle>
    <Fomr1 />

    <HTitle>
      <span>表单2 - 固定宽度</span>
      <template v-slot:dec>
        rules校验抽出单独写一个数组，自定义校验规则，hasFeedback校验返回校验图标，校验成功失败由finish、onFinishFailed判断
      </template>
    </HTitle>
    <Fomr2 />

    <HTitle>
      <span>表单3 - 使用 useForm</span>
      <template v-slot:dec>
        Form.useForm 自定义触发校验时机
      </template>
    </HTitle>
    <Fomr3 />
  </div>
</template>

<script>
import Fomr1 from './components/Form1';
import Fomr2 from './components/Form2';
import Fomr3 from './components/Form3';

export default {
  name: "DemoDetail",
  components: {
    Fomr1,
    Fomr2,
    Fomr3,
  },
};
</script>
