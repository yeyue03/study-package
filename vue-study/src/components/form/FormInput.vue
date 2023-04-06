<template>
  <a-input
    v-if="!showText"
    :value="value"
    @change="handleChange"
    @keydown.enter.stop.prevent
  ></a-input>
  <span v-else class="detail-text">{{ value }}</span>
</template>

<script>
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "FormInput",
  props: {
    value: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    const showText = inject("showText", false);

    const handleChange = (e) => {
      const value = e.target.value;
      emit("update:value", value);
      emit("onChange", value);
    };

    return {
      showText,
      handleChange,
    };
  },
});
</script>
