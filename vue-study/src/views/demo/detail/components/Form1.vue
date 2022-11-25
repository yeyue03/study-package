<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 3 }"
    :wrapper-col="{ span: 5 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名称!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ required: true, message: '请输入密码!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 3, span: 10 }">
      <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 3, span: 10 }">
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const formState = reactive({
      username: '',
      password: '',
      remember: true,
    });
    const onFinish = (values) => {
      message.success('操作成功');
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
      message.warning('操作失败');
    };

    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

