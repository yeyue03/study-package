<template>
  <a-modal
    wrapClassName="one-column-modal"
    title="方案"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="submitLoading"
    :width="700"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button size="large" @click="handleCancel">取消</a-button>
    </template>

    <a-table size="small" :columns="columns" :data-source="dataSource">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="btn-box">
            <a>替换</a>
            <a>删除</a>
            <a>保存为新方案</a>
          </div>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
// import FuelSurchargeAPI from '@/api/tms/fuelSurcharge';
// import { message } from "ant-design-vue";

export default defineComponent({
  name: "PopSaveScheme",
  setup() {
    const visible = ref(false);
    const submitLoading = ref(false);

    const columns = computed(() => {
      return [
        {
          title: "方案名称",
          dataIndex: "name",
          key: "name",
          width: 400,
          ellipsis: true
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
        },
      ]
    })

    const dataSource = [
      {
        key: "1",
        name: '方案01'
      },
      {
        key: "2",
        name: '方案02'
      },
      {
        key: "3",
        name: '测试方案003'
      },
    ];

    const showModal = () => {
      visible.value = true;
    };

    const handleCancel = () => {
      visible.value = false;
    };

    return {
      visible,
      columns,
      dataSource,
      submitLoading,
      showModal,
      handleCancel,
    };
  },
});
</script>

<style lang="less" scoped>
.btn-box {
  width: 100%;
  a {
    margin: 0 8px;
  }
}
</style>
