<template>
  <div class="board">
    <div class="loop-box">
      <div class="tag-box">
        <span class="tag-span">{{ formState.isRightLoop ? t('device.settings.loopRight') : t('device.settings.loopLeft') }}</span>
      </div>
      <i :class="`iconfont ${formState.icon}`"></i>
      <div class="tag-box">
        <template v-if="formState.isRightLoop">
          <span
            v-if="!formState.isshowLoopInput"
            class="loop-span"
            @click="showLoopInput(true)"
            >{{ formState.loop }}x</span
          >
          <a-input-number
            v-else
            class="loop-span"
            :min="1"
            :max="100"
            :step="1"
            :precision="0"
            v-focus
            v-model:value="formState.loop"
            @blur="showLoopInput(false)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: "PanelLoop",
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

    // 是否显示循环次数输入框
    const showLoopInput = (bool: boolean) => {
      formState.isshowLoopInput = bool;
      if (!bool) {
        emit("changePanel", formState);
      }
    };

    const changeDate = () => {
      emit("changePanel", formState);
    };

    return {
      t,
      formState,
      showLoopInput,
      changeDate,
    };
  },
  directives: {
    focus: {
      mounted: (el: any) => el.querySelector('input').focus(),
    },
  },
});
</script>

<style lang="less" scoped>
@rowHeight: 214px;

.board {
  width: 120px !important;
}
.loop-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
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
.loop-span {
  width: 80px;
  margin: 0 auto;
  text-align: center;
}
.ant-input-number-input {
  text-align: center;
}
</style>
