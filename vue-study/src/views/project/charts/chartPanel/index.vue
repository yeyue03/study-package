<template>
  <a-spin :spinning="pageLoading">
    <div class="panel-wrap">
      <div v-for="(obj, key) in dataSourceObj" :key="key">
        <LineChart :chartData="obj.data" :chartConfig="obj.config" />
      </div>
    </div>
  </a-spin>
</template>

<script>
import { ref, defineComponent, onBeforeUnmount, reactive, toRefs, watch } from 'vue';
import LineChart from './LineChart.vue';
import mitt from "@/utils/mitt.js";

export default defineComponent({
  name: 'ChartPanel',
  components: {
    LineChart
  },
  props: {
    pageName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  setup(props) {
    const { pageName } = toRefs(props);

    const dataSourceObj = reactive({
      temperature: {},
      humidity: {},
    })

    const pageLoading = ref(false);
    watch(pageName, () => {
      pageLoading.value = true;
      setTimeout(() => {
        pageLoading.value = false;
      }, 500);
    })

    const setDataSourceObj = (key, list) => {
      if (!list) {
        return
      }

      let arr = [];
      let duration = 0;

      for (const item of list) {
        if (duration === 0) {
          arr.push({ type: '预设', time: 0, value: item.startValue })
        }
        duration += item.duration;
        arr.push({ type: '预设', time: duration, value: item.endValue })
      }

      // 计算x轴间隔30min 的最大值
      let max = duration % 60;
      max = duration + Math.abs(30 - max);

      dataSourceObj[key]['data'] = arr;
      dataSourceObj[key]['config'] = {
        max,
        xtitle: '2023年1月1日',
        ytitle: key == 'temperature' ? '温度监控表' : '湿度监控表'
      };
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
      dataSourceObj,
      pageLoading
    }
  },
})
</script>

<style scoped>
.panel-wrap {
  width: 100%;
  padding: 50px 20px;
  box-sizing: border-box;
  /* background: #fff; */
}

:deep(.ant-spin-container::after) {
  background: none;
}
</style>
