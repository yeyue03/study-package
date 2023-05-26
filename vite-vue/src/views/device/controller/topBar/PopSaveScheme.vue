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
      <a-form-item label="方案名称" v-bind="validateInfos.schemeName" name="schemeName">
        <a-input v-model:value="formState.schemeName" :maxLength="50" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
// import FuelSurchargeAPI from '@/api/tms/fuelSurcharge';
import { message, Form } from 'ant-design-vue';
import type { ControlObj } from '../types';

const useForm = Form.useForm;
export default defineComponent({
  name: 'PopSaveScheme',
  setup() {
    const visible = ref(false);
    const submitLoading = ref(false);
    const saveDataObj = ref();

    const addType = ref('add');
    const formRef = ref();
    const formState = reactive({
      schemeName: '',
    });
    const rules = computed(() => {
      return {
        schemeName: [{ type: 'string', required: true, message: '请输入方案名称', trigger: 'blur' }],
      }
    });

    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    const showModal = (obj: ControlObj) => {
      resetFields();
      visible.value = true;
      saveDataObj.value = obj;
      console.log('保存的值：', saveDataObj.value);
    }

    const handleCancel = () => {
      visible.value = false
    }

    // 提交
    const onSubmit = () => {
      validate()
        .then(async () => {
          submitLoading.value = true;
          message.success('操作成功');

          // let params = JSON.parse(JSON.stringify(formState));
          // let funName = 'AddFuelSurcharge';
          // if (addType.value === 'edit') {
          //   funName = 'EditFuelSurcharge';
          // }
          // FuelSurchargeAPI[funName](params).then(res => {
          //   submitLoading.value = false;
          //   if (res.code === 200) {
          //     handleCancel();
          //     // emit('submitSuccess');
          //     message.success('操作成功');
          //   }
          // }).catch(err => {
          //   submitLoading.value = false;
          // })
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
