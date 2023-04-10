<template>
  <a-col>
    <div class="top-btn">
      <a-button @click="showAddTypePop">新增字典</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="data"
      size="small"
      :pagination="false"
    >
    </a-table>
  </a-col>

  <!-- 新增字典 -->
  <AddDictionaryType ref="addDictionaryTypeRef" />
</template>

<script>
import { defineComponent, ref } from "vue";
import AddDictionaryType from "./AddDictionaryType.vue";

const columns = [
  {
    title: "系统名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "分类",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
];

const data = [
  {
    name: "国家",
    type: "系统全局",
    code: 101,
  },
  {
    name: "项目",
    type: "系统全局",
    code: 102,
  },
  {
    name: "影院",
    type: "系统全局",
    code: 103,
  },
];

const addDictionaryTypeRef = ref();
const showAddTypePop = () => {
  addDictionaryTypeRef.value.showModal("add");
  addDictionaryTypeRef.value.setFormValue();
};

export default defineComponent({
  name: "DictionaryType",
  components: {
    AddDictionaryType,
  },
  setup() {
    return {
      data,
      columns,
      addDictionaryTypeRef,
      showAddTypePop,
    };
  },
});
</script>

<style scoped>
.top-btn {
  padding: 15px 0;
}
</style>
