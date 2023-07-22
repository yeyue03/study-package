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
import { SettingsArr } from '../types';
import { planTemplateAdd } from '../controller.api';
const useForm = Form.useForm;
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: 'PopSaveScheme',
  setup() {
    const { t } = useI18n();
    const visible = ref(false);
    const submitLoading = ref(false);
    const settingsArr = ref<SettingsArr>([]); // 保存的计划数据

    const addType = ref('add');
    const formRef = ref();
    const formState = reactive({
      name: '',
    });
    const rules = computed(() => {
      return {
        name: [{ type: 'string', required: true, message: t('device.tips.pleaseInputSchemeName'), trigger: 'blur' }],
      }
    });

    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    const showModal = (setArr: SettingsArr) => {
      resetFields();
      visible.value = true;
      settingsArr.value = setArr;
    }

    const handleCancel = () => {
      visible.value = false
    }

    const injectDeviceObj: any = inject('changeDeviceObj', {})
    // 提交
    const onSubmit = () => {
      if (!injectDeviceObj.value?.id) {
        return message.warning(t('device.tips.pleaseChoseDevice'));
      }

      validate()
        .then(async () => {
          submitLoading.value = true;

          const deviceObj = injectDeviceObj.value;
          const params = {
            deviceId: deviceObj.id,
            name: formState.name,
            settings: JSON.stringify(settingsArr.value),
          }
          
          planTemplateAdd(params).then(() => {
            message.success(t('device.tips.success'));
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
