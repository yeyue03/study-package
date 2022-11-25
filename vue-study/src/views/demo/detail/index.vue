<template>
  <div class="detail">
    <h2>表单 - rules校验直接写form-item上，校验成功失败由finish、onFinishFailed判断</h2>
    <Fomr1 />
  </div>
</template>

<script>
import Fomr1 from './components/Form1';

export default {
  name: "DemoDetail",
  components: {
    Fomr1
  },
};
</script>
