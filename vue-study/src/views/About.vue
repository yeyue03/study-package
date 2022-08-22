<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <div @click="copyClick">复制</div>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();

export default defineComponent({
  setup() {
    const visible = ref(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e) => {
      console.log(e);
      visible.value = false;
    };

    const copyClick = () => {
      toClipboard('这是复制的内容');
      message.info('复制成功');
    }

    return {
      visible,
      showModal,
      handleOk,
      copyClick,
    };
  },
});
</script>

