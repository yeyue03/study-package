<template>
  <a-modal
    wrapClassName="one-column-modal"
    title="保存"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="submitLoading"
    :width="700"
    @ok="onSubmit"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button size="large" @click="handleCancel">取消</a-button>
      <a-button size="large" type="primary" :loading="submitLoading" @click="onSubmit">保存</a-button>
    </template>

    <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="计划模板名称" v-bind="validateInfos.name" name="name">
        <a-input v-model:value="formState.name" :maxLength="50" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, inject } from 'vue';
import { message, Form } from 'ant-design-vue';
import type { PanelObj } from '../types';
import { planTemplateAdd } from '../controller.api';

const useForm = Form.useForm;
export default defineComponent({
  name: 'PopSaveScheme',
  setup() {
    const visible = ref(false);
    const submitLoading = ref(false);
    const saveDataObj = ref(); // 保存的计划数据

    const addType = ref('add');
    const formRef = ref();
    const formState = reactive({
      name: '',
    });
    const rules = computed(() => {
      return {
        name: [{ type: 'string', required: true, message: '请输入方案名称', trigger: 'blur' }],
      }
    });

    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    const standardType = ref('temperature');
    const showModal = (obj: PanelObj, sType: string) => {
      resetFields();
      visible.value = true;
      saveDataObj.value = obj;
      standardType.value = sType || 'temperature'
    }

    const handleCancel = () => {
      visible.value = false
    }

    const injectDeviceObj = inject('changeDeviceObj', {})
    // 提交
    const onSubmit = () => {
      if (!injectDeviceObj.value?.id) {
        return message.warning('请先选取设备');
      }

      validate()
        .then(async () => {
          submitLoading.value = true;

          const deviceObj = injectDeviceObj.value;
          const params = {
            deviceId: deviceObj.id,
            name: formState.name,
            settings: JSON.stringify(saveDataObj.value),
            standardType: standardType.value
          }
          
          planTemplateAdd(params).then(res => {
            message.success('操作成功');
            submitLoading.value = false;
            handleCancel();
            
          }).catch(() => {
            submitLoading.value = false;
          })
        })
    }

    return {
      visible,
      submitLoading,
      addType,
      formRef,
      validateInfos,
      formState,
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      showModal,
      handleCancel,
      onSubmit,
    };
  },
});
</script>
