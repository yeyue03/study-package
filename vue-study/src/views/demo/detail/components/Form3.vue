<template>
  <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="活动名称" v-bind="validateInfos.name">
      <a-input
        v-model:value="modelRef.name"
        @blur="validate('name', { trigger: 'blur' }).catch(() => {})"
      />
    </a-form-item>
    <a-form-item label="活动区域" v-bind="validateInfos.region">
      <a-select v-model:value="modelRef.region" placeholder="请选择区域">
        <a-select-option value="shanghai">上海</a-select-option>
        <a-select-option value="beijing">北京</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 3 }">
      <a-button type="primary" @click.prevent="onSubmit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetFields">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, toRaw } from 'vue';
import { Form } from 'ant-design-vue';

const useForm = Form.useForm;
export default defineComponent({
  setup() {
    const modelRef = reactive({
      name: '',
      region: undefined,
    });
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: 'Please input Activity name',
        },
        {
          min: 3,
          max: 5,
          message: 'Length should be 3 to 5',
          trigger: 'blur',
        },
      ],
      region: [
        {
          required: true,
          message: 'Please select region',
        },
      ],
    });
    const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
    const onSubmit = () => {
      validate()
        .then(() => {
          console.log(toRaw(modelRef));
        })
        .catch(err => {
          console.log('error', err);
        });
    };
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 5 },
      validate,
      validateInfos,
      resetFields,
      modelRef,
      onSubmit,
    };
  },
});
</script>

