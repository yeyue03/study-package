<template>
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item has-feedback label="密码" name="pass">
      <a-input
        v-model:value="formState.pass"
        type="password"
        autocomplete="off"
      />
    </a-form-item>
    <a-form-item has-feedback label="确认密码" name="checkPass">
      <a-input
        v-model:value="formState.checkPass"
        type="password"
        autocomplete="off"
      />
    </a-form-item>
    <a-form-item has-feedback label="年龄" name="age">
      <a-input-number v-model:value="formState.age" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 3 }">
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="submitClick">自定义方法提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState = reactive({
      pass: "",
      checkPass: "",
      age: undefined,
    });
    let checkAge = async (_rule, value) => {
      if (!value) {
        return Promise.reject("请输入年龄");
      }
      if (!Number.isInteger(value)) {
        return Promise.reject("请输入数字");
      } else {
        if (value < 18) {
          return Promise.reject("年龄必须大于18岁");
        } else {
          return Promise.resolve();
        }
      }
    };

    let validatePass = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("请输入密码");
      } else {
        if (formState.checkPass !== "") {
          formRef.value.validateFields("checkPass");
        }
        return Promise.resolve();
      }
    };

    // 密码规则校验
    let validatePass2 = async (_rule, value) => {
      if (value === "") {
        return Promise.reject("请再次输入密码");
      } else if (value !== formState.pass) {
        return Promise.reject("两次输入的密码不一致");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      pass: [{ required: true, validator: validatePass, trigger: "change" }],
      checkPass: [{ validator: validatePass2, trigger: "change" }],
      age: [{ validator: checkAge, trigger: "change" }],
    };
    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 5 },
    };
    const handleFinish = (values) => {
      console.log(values, formState);
    };
    const handleFinishFailed = (errors) => {
      console.log(errors);
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    const handleValidate = (...args) => {
      console.log(args);
    };

    const submitClick = () => {
      formRef.value.validate().then(res => {
        console.log("== 校验通过", res);
      }).catch(err => {
        console.log("== 校验错误", err);
      });
    }

    return {
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
      handleValidate,
      submitClick
    };
  },
});
</script>
