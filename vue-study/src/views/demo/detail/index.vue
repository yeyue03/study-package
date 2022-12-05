<template>
  <div class="detail">
    <h2>表单1 - rules校验直接写form-item上，校验成功失败由finish、onFinishFailed判断</h2>
    <Fomr1 />

    <h2>表单2 - rules校验抽出单独写一个数组，自定义校验规则，hasFeedback校验返回校验图标，校验成功失败由finish、onFinishFailed判断</h2>
    <Fomr2 />

    <h2>表单3 - Form.useForm 自定义触发校验时机</h2>
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
