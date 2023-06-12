<template>
  <div class="box-wrap">
    <div class="box">
      <div class="top-box"></div>
      <div class="table">
        <a-table sticky :columns="columns" :data-source="data" :scroll="{ x: 1500 }">
          
        </a-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const columns = ref<TableColumnsType>([
      {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
      },
      {
        title: 'Age',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        fixed: 'left',
      },
      {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width: 150,
      },
      {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width: 150,
      },
      {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
        width: 150,
      },
      {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
        width: 150,
      },
      {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
        width: 150,
      },
      {
        title: 'Column 6',
        dataIndex: 'address',
        key: '6',
        width: 150,
      },
      {
        title: 'Column 7',
        dataIndex: 'address',
        key: '7',
        width: 150,
      },
      { title: 'Column 8', dataIndex: 'address', key: '8' },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
      },
    ]);

    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    return {
      data,
      columns,
    };
  },
});
</script>
<style>
.box-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}
.box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: inherit;
}
.top-box {
  height: 500px;
  border: solid;
}
.table {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
}
</style>
