<template>
  <a-modal
    wrapClassName="one-column-modal"
    :visible="visible"
    :title="title[addType]"
    :maskClosable="false"
    :confirmLoading="submitLoading"
    :width="700"
    @ok="onSubmit"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-checkbox v-model:checked="recreate" v-if="addType === 'add'">保存后再创建一个</a-checkbox>
      <a-button size="large" @click="handleCancel">
        取消
      </a-button>
      <a-button v-if="addType != 'detail'" size="large" type="primary" :loading="submitLoading" @click="onSubmit">
        保存
      </a-button>
    </template>

    <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="状态" v-bind="validateInfos.status" name="status">
        <template v-if="addType == 'detail'">{{ formState.status == 1 ? '启用' : '停用' }}</template>
        <a-select
          v-else
          v-model:value="formState.status"
          allowClear
          placeholder="请选择"
        >
          <a-select-option :value="1">启用</a-select-option>
          <a-select-option :value="0">停用</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="方案名称" v-bind="validateInfos.zoneSchemeName" name="zoneSchemeName">
        <template v-if="addType == 'detail'">{{ formState.zoneSchemeName }}</template>
        <a-input v-else v-model:value="formState.zoneSchemeName" :maxLength="50" ></a-input>
      </a-form-item>

      <a-form-item label="备注" name="remark">
        <template v-if="addType == 'detail'">{{ formState.remark }}</template>
        <a-input v-else v-model:value="formState.remark" :maxLength="200" ></a-input>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, ref, toRaw } from 'vue';
// import ZoneSchemeAPI from '@/api/tms/zoneScheme';
import { Form } from 'ant-design-vue';

const useForm = Form.useForm;
export default defineComponent({
  name: 'AddDictionaryType',
  props: {},
  setup(props, { emit }) {
    const visible = ref(false);
    const submitLoading = ref(false);
    const recreate = ref(false);

    const addType = ref('add');
    const formRef = ref();
    const formState = reactive({
      status: undefined,
      zoneSchemeName: '',
      remark: ''
    });

    // 规则校验
    const rules = reactive({
      status: [{ type: 'number', required: true, message: '请选择状态', trigger: 'blur' }],
      zoneSchemeName: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
    });

    const { resetFields, validate, validateInfos } = useForm(formState, rules);

    // 表单赋值
    const setFormValue = (record) => {
      resetFields();

      if (addType.value === 'edit' || addType.value === 'copy' || addType.value === 'detail') {
        formState.id = record.id;
        formState.status = record.status;
        formState.zoneSchemeName = record.zoneSchemeName;
        formState.remark = record.remark;
      }
    }

    // 显示弹窗
    const showModal = (type) => {
      visible.value = true
      addType.value = type
    }

    // 取消弹窗
    const handleCancel = () => {
      visible.value = false
    }

    // 提交
    const onSubmit = () => {
      validate()
        .then(async () => {
          submitLoading.value = true;
          let params = JSON.parse(JSON.stringify(toRaw(formState)));
          let funName = 'AddZoneScheme';
          if (addType.value === 'edit') {
            funName = 'EditZoneScheme';
          } else if (addType.value === 'copy') {
            funName = 'CopyZoneScheme'
          }
          // ZoneSchemeAPI[funName](params).then(res => {
          //   submitLoading.value = false;
          //   if (res.code === 200) {
          //     if (addType.value === 'add' && recreate.value) {
          //       resetFields();
          //     } else {
          //       handleCancel();
          //     }
          //     emit('submitSuccess');
          //     message.success('操作成功');
          //   }
          // }).catch(err => {
          //   submitLoading.value = false;
          //   console.log("提交错误：", err);
          // })
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
      recreate,
      formState,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      title: {
        add: '新增',
        edit: '编辑',
        copy: '复制',
        detail: '详情',
      },
      setFormValue,
      showModal,
      handleCancel,
      onSubmit,
    };
  },
});
</script>

<style scoped></style>
