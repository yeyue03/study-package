<template>
  <div class="board">
    <div class="clock-timer">
      <div class="tag-box">
        <span class="tag-span">{{ t('device.settings.reservation') }}</span>
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

      <div class="tag-box"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";
import { useI18n } from '@/hooks/web/useI18n';

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
    const { t } = useI18n();
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
      t,
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

.board {
  width: 170px !important;
}
.clock-timer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
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
