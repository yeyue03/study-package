<template>
  <div class="container">
    <el-table :data="tableData" style="width: 100%" v-horizontal-scroll="'always'">
      <el-table-column fixed prop="date" label="Date" width="250" />
      <el-table-column prop="name" label="Name" width="220" />
      <el-table-column prop="state" label="State" width="220" />
      <el-table-column prop="city" label="City" width="320" />
      <el-table-column prop="address" label="Address" width="600" />
      <el-table-column prop="zip" label="Zip" width="220" />
    </el-table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ElTableScroll',
  setup() {
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
      tableData
    }
  },
})
</script>