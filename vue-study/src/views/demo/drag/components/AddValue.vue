<template>
  <a-modal
    wrapClassName="one-column-modal"
    :visible="visible"
    title="新增"
    :maskClosable="false"
    :confirmLoading="submitLoading"
    :width="700"
    @ok="onSubmit"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button size="large" @click="handleCancel">
        取消
      </a-button>
      <a-button size="large" type="primary" :loading="submitLoading" @click="onSubmit">
        保存
      </a-button>
    </template>

    <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="x轴值" v-bind="validateInfos.xval">
        <a-input v-model:value="formState.xval"></a-input>
      </a-form-item>

      <a-form-item label="y轴值" v-bind="validateInfos.yval">
        <a-input-number style="width: 100%" v-model:value="formState.yval"></a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { message, Form } from 'ant-design-vue';
import mitt from "@/utils/mitt.js";

const useForm = Form.useForm;
export default defineComponent({
  name: 'AddValue',
  props: {},
  setup(props, { emit }) {
    const visible = ref(false);
    const submitLoading = ref(false);

    const addType = ref('add');
    const formRef = ref();
    const formState = reactive({
      xval: '',
      yval: '',
    });

    const rules = reactive({
      xval: [{ required: true, message: '请输入', trigger: 'blur' }],
      yval: [{ required: true, message: '请输入', trigger: 'blur' }],
    });

    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    const setFormValue = (record) => {
      resetFields();
    }

    const showModal = (type) => {
      visible.value = true
      addType.value = type
    }

    const handleCancel = () => {
      visible.value = false
    }

    // 提交
    const onSubmit = () => {
      validate()
        .then(async () => {
          // submitLoading.value = true;

          mitt.emit('addLineChartData', formState);
          handleCancel();
        })
        .catch(error => {
          console.log('error', error);
        });
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
      setFormValue,
      showModal,
      handleCancel,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.color-red {
  color: #f74a4a;
}
</style>
