<template>
  <div class="board">
    <div class="clock-timer">
      <div class="tag-box">
        <span class="tag-span">CLOCK TIMER</span>
      </div>
      <a-date-picker
        show-time
        v-model:value="formState.date"
        format="YYYY-MM-DD HH:mm"
        valueFormat="YYYY-MM-DD HH:mm"
        @change="changeDate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";

export default defineComponent({
  name: "PanelReservation",
  props: {
    panelObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["changePanel"],
  setup(props, { emit }) {
    const { panelObj } = toRefs(props);

    const formState = reactive({
      ...panelObj.value,
    });

    const changeDate = () => {
      emit("changePanel", formState);
    };

    return {
      formState,
      changeDate,
    };
  },
});
</script>

<style lang="less" scoped>
@rowHeight: 214px;
@boardBgColor: #333;

.board {
  width: 170px !important;
}
.clock-timer {
  width: 100%;
  height: 100%;
  background: @boardBgColor;
}

.tag-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 5px;
  box-sizing: border-box;

  .tag-span {
    text-align: left;
  }
}
</style>
