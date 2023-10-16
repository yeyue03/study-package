<template>
  <div class="container">
    <a-table ref="tableRef" :columns="columns" :data-source="tableData" :scroll="{x: 1200}">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a>action</a>
        </template>
      </template>
    </a-table>

    <div ref="scrollBoxRef" class="scroll-box" @scroll="handleScroll">
      <div class="scroll-block" :style="scrollBlockStyle"></div>
    </div>

  </div>
</template>

<script>
import { defineComponent, nextTick, reactive, ref } from 'vue'

export default defineComponent({
  name: 'ElTableScroll',
  setup() {
    const tableRef = ref();
    const scrollBoxRef = ref();
    const columns = [
      { title: 'date', dataIndex: 'date', key: 'date',  width: 400, fixed: 'left' },
      { title: 'name', dataIndex: 'name', key: 'name',  width: 400 },
      { title: 'state', dataIndex: 'state', key: 'state',  width: 400 },
      { title: 'city', dataIndex: 'city', key: 'city',  width: 400 },
      { title: 'address', dataIndex: 'address', key: 'address',  width: 400 },
      { title: 'zip', dataIndex: 'zip', key: 'zip',  width: 400 },
    ];

    const tableData = ref([])
    for (let i=0; i<20; i++) {
      tableData.value.push({
        date: '2016-05-03',
        name: 'Tom' + i,
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
      })
    }

    const scrollBlockStyle = reactive({
      width: 200
    })
    nextTick(() => {
      const tableScrollDom = tableRef.value.$el.getElementsByClassName('ant-table-content')[0];
      tableScrollDom.addEventListener("scroll", e => {
        scrollBoxRef.value.scrollLeft = e.target.scrollLeft;
      })

      const tableDom = tableRef.value.$el.getElementsByClassName('ant-table-tbody')[0];
      scrollBlockStyle.width = tableDom.clientWidth + 'px';
    })

    const handleScroll = e => {
      let tableScrollDom = tableRef.value.$el.getElementsByClassName('ant-table-content')[0];
      tableScrollDom.scrollLeft = e.target.scrollLeft;
    }

    return {
      tableRef,
      scrollBoxRef,
      columns,
      tableData,
      scrollBlockStyle,
      handleScroll,
    }
  },
})
</script>

<style scoped>
.scroll-box {
  z-index: 5;
  position: fixed;
  left: 220px;
  right: 40px;
  bottom: 20px;
  overflow-x: auto;
}
.scroll-block {
  height: 1px;
}

:deep(.ant-table-content::-webkit-scrollbar) {
  display: none;
}
</style>