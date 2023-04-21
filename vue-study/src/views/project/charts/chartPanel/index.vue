<template>
  <a-spin :spinning="pageLoading">
    <div class="panel-wrap">
      <div v-for="(list, key) in dataSourceObj" :key="key">
        <LineChart :dataSource="list" />
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
      temperature: [],
      humidity: [],
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
      dataSourceObj,
      pageLoading
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

:deep(.ant-spin-container::after) {
  background: none;
}
</style>
