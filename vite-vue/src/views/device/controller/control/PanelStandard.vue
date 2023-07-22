<template>
  <div class="board">
    <div class="standard-box">
      <div class="tag-box">
        <span class="tag-span">{{ t('device.settings.standard') }}</span>
      </div>

      <div v-if="!formState.isShowStandard" @click="showStandardSelect(true)">
        <span class="padding-span">{{ standardTypeObj[formState.standardType] }}</span>
      </div>
      <template v-else>
        <a-select class="padding-span" v-model:value="formState.standardType" v-focus @blur="showStandardSelect(false)">
          <a-select-option value="temperature">{{ t('device.settings.temperature') }}</a-select-option>
          <a-select-option value="humidity">{{ t('device.settings.humidity') }}</a-select-option>
          <a-select-option value="both">{{ t('device.settings.temperatureAndHumidity') }}</a-select-option>
        </a-select>
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

    const standardTypeObj: any = reactive({
      temperature: '温度',
      humidity: '湿度',
      both: '温湿度',
    })

    const formState = reactive({
      ...panelObj.value,
    });

    const showStandardSelect = (bool: boolean) => {
      formState.isShowStandard = bool;
      if (!bool) {
        emit("changePanel", formState);
      }
    };

    const getDateStr = (type: string) => {
      let _str = '';
      const _date = formState.standardType;
      if (_date) {
        _str = type == 'day' ? _date.slice(0, 10) : _date.slice(11);
      }

      return _str;
    }

    return {
      t,
      formState,
      standardTypeObj,
      showStandardSelect,
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
  width: 120px !important;
}
.standard-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
.padding-span {
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
