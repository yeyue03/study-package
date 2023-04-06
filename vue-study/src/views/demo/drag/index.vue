<template>
  <div class="container list">
    <div class="operation-wrap">
      <div></div>
      <div class="operaion-btns">
        <a-button
          type="primary"
          draggable="true"
          ghost
          @dragstart="dragStartEvent"
          @click="handleAdd"
          >新增</a-button
        >
      </div>
    </div>

    <div class="table-wrap" @drop="dropEvent" @dragover="dragoverEvent">
      <LineChart echartId="line02" style="width: 100%; height: 260px" />
    </div>

    <add-value ref="addValueRef"></add-value>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import LineChart from "./components/LineChart.vue";
import AddValue from "./components/AddValue.vue";

export default defineComponent({
  name: "DemoDrag",
  components: {
    LineChart,
    AddValue,
  },
  setup() {
    const addValueRef = ref();

    // 新增
    const handleAdd = () => {
      addValueRef.value.showModal("add");
      addValueRef.value.setFormValue();
    };

    const dragStartEvent = (e) => {
      e.dataTransfer.setData("add", "Y");
      e.dataTransfer.setData("bbb", "Y55");
    };

    const dropEvent = (e) => {
      e.preventDefault();
      const val = e.dataTransfer.getData("add");
      if (val) {
        handleAdd();
      }
    };

    const dragoverEvent = (e) => {
      e.preventDefault();
    };

    return {
      addValueRef,
      handleAdd,
      dragStartEvent,
      dropEvent,
      dragoverEvent,
    };
  },
});
</script>

<style lang="less" scoped>
.operation-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  :deep(.ant-tabs-nav) {
    height: 45px;
    margin: 0;
  }
  :deep(.ant-btn) {
    margin: 0 10px;
  }
}
</style>
