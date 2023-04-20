<template>
  <div class="panel-wrap">
    <LineChart />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import LineChart from './LineChart.vue';

export default defineComponent({
  name: 'ChartPanel',
  components: {
    LineChart
  },
  setup() {
    
  },
})
</script>

<style scoped>
.panel-wrap {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
