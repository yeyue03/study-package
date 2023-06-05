<template>
  <div class="board">
    <div class="clock-timer">
      <div class="tag-box">
        <span class="tag-span">CLOCK TIMER</span>
      </div>

      <div v-if="!formState.isShowDateInput && formState.date" @click="showDateInput(true)">
        <div class="date-str">{{ getDateStr('day') }}</div>
        <div class="date-str">{{ getDateStr('hour') }}</div>
      </div>
      <template v-else>
        <a-date-picker
          show-time
          v-model:value="formState.date"
          v-focus
          format="YYYY-MM-DD HH:mm"
          valueFormat="YYYY-MM-DD HH:mm"
          @blur="showDateInput(false)"
        />
      </template>

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

    const showDateInput = (bool: boolean) => {
      formState.isShowDateInput = bool;
      if (!bool) {
        emit("changePanel", formState);
      }
    };

    const getDateStr = (type: string) => {
      let _str = '';
      const _date = formState.date;
      if (_date) {
        _str = type == 'day' ? _date.slice(0, 10) : _date.slice(11);
      }

      return _str;
    }

    return {
      formState,
      showDateInput,
      getDateStr
    };
  },
  directives: {
    focus: {
      mounted: (el: any) => el.querySelector("input").focus()
    }
  }
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
.date-str {
  padding: 2px 6px;
  text-align: left;
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
