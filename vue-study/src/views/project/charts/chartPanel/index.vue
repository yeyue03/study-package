<template>
  <div class="panel-wrap">
    <div v-for="(list, key) in dataSourceObj" :key="key">
      <LineChart :dataSource="list" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, reactive } from 'vue';
import LineChart from './LineChart.vue';
import mitt from "@/utils/mitt.js";

export default defineComponent({
  name: 'ChartPanel',
  components: {
    LineChart
  },
  setup() {
    const dataSourceObj = reactive({
      temperature: [],
      humidity: [],
    })

    const setDataSourceObj = (key, list) => {
      if (!list) {
        return
      }

      let arr = [
        ['', '预设']
      ];
      let duration = 0;
      for (const item of list) {
        if (duration === 0) {
          arr.push([duration, item.startValue])
        }
        duration += item.duration;
        arr.push([duration, item.endValue])
      }

      dataSourceObj[key] = arr;
    }

    mitt.on('changeControlObj', (obj) => {
      if (obj) {
        for (let [key, value] of Object.entries(obj)) {
          setDataSourceObj(key, value);
        }
      }
    })

    onBeforeUnmount(() => {
      mitt.off('changeControlObj');
    })

    return {
      dataSourceObj
    }
  },
})
</script>

<style scoped>
.panel-wrap {
  width: 100%;
  padding-top: 30px;
  /* background: #fff; */
}
</style>
