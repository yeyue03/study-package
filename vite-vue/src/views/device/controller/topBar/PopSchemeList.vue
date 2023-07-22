<template>
  <a-modal
    wrapClassName="one-column-modal"
    :title="t('device.infoPop.scheme')"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="submitLoading"
    :width="700"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button size="large" @click="handleCancel">{{ t('device.infoPop.cancel') }}</a-button>
    </template>

    <a-table size="small" :columns="columns" :data-source="dataSource">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="btn-box">
            <a @click="replacePlan(record.settings)">{{ t('device.infoPop.replace') }}</a>
            <a @click="deletePlanTemplate(record.id)">{{ t('device.infoPop.delete') }}</a>
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
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: "PopSchemeList",
  setup() {
    const { t } = useI18n();
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
    const dataSource: any = ref([]);

    // deviceId
    const getTemplateList = () => {
      dataSource.value = [];
      const params = {
        deviceId: nowDeviceId.value
      }
      planTemplateList(params).then((data: any) => {
        dataSource.value = data || [];
      })
    }

    const deletePlanTemplate = (id: number) => {
      planTemplateDelete(id).then(() => {
        message.success(t('device.tips.deleteSuccess'));
        getTemplateList();
      })
    }

    // 把计划详情替换到当前模板
    const replacePlan = (settings: string) => {
      if (!settings) {
        message.warning(t('device.tips.templateNull'))
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
      t,
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
