<template>
  <div>
    <span>主页</span>
    <div class="echarts-wrap">
      <StackedAreaChart />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import StackedAreaChart from './components/StackedAreaChart.vue';

export default defineComponent({
  name: "Home",
  components: {
    StackedAreaChart
  },
  setup() {

    return {
      
    }
  },
})
</script>

<style scoped>
.echarts-wrap {
  width: 300px;
  height: 300px;
}
</style>