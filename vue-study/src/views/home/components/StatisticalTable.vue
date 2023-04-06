<template>
  <a-table :columns="columns" :data-source="data" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>

      <template v-else-if="column.key === 'status'">
        <span>
          <a-tag :color="record.color">{{ record.status }}</a-tag>
        </span>
      </template>
    </template>
  </a-table>
</template>

<script>
import { defineComponent } from "vue";
const columns = [
  {
    name: "经理",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "门店",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
  },
];

const data = [
  {
    key: "1",
    name: "周星驰",
    address: "上海浦东分店",
    status: "低",
    color: "green",
  },
  {
    key: "2",
    name: "周星驰",
    address: "上海浦东分店",
    status: "高",
  },
  {
    key: "3",
    name: "周星驰",
    address: "上海浦东分店",
    status: "正常",
    color: "geekblue",
  },
];

export default defineComponent({
  components: {},
  setup() {
    return {
      data,
      columns,
    };
  },
});
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background: none;
}
</style>
