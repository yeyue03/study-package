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
            <a @click="replacePlan(record.settings)">替换</a>
            <a @click="deletePlanTemplate(record.id)">删除</a>
          </div>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { message } from "ant-design-vue";
import { planTemplateList, planTemplateDelete } from '../controller.api';
import { setReplacePlan } from '../useMitt';

export default defineComponent({
  name: "PopSaveScheme",
  setup() {
    const visible = ref(false);
    const submitLoading = ref(false);

    const columns = computed(() => {
      return [
        {
          title: "计划模板名称",
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

    const nowDeviceId = ref(0);
    const dataSource = ref([]);

    // deviceId
    const getTemplateList = () => {
      dataSource.value = [];
      const params = {
        deviceId: nowDeviceId.value
      }
      planTemplateList(params).then(data => {
        dataSource.value = data || [];
      })
    }

    const deletePlanTemplate = (id: number) => {
      planTemplateDelete(id).then(() => {
        message.success('删除成功');
        getTemplateList();
      })
    }

    // 把计划详情替换到当前模板
    const replacePlan = (settings: string) => {
      if (!settings) {
        message.warning('该模板值为空')
      }

      setReplacePlan(settings);
      handleCancel();
    }

    const showModal = (deviceId: number) => {
      nowDeviceId.value = deviceId;
      getTemplateList();
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
      deletePlanTemplate,
      replacePlan
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
