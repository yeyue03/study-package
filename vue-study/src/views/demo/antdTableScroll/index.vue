<template>
  <div class="container">
    <a-table :columns="columns" :data-source="tableData" :scroll="{ x: 1200 }">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a>action</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ElTableScroll',
  setup() {
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

    return {
      columns,
      tableData
    }
  },
})
</script>