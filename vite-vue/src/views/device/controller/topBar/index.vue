<template>
  <div class="top-bar">
    <div class="bar-left">
      <OptionsBtnUp v-show="pageName == 'Editor'" />
      <OptionsBtnDown :pageName="pageName" />
    </div>

    <div class="nav-box">
      <span :class="{ active: pageName == 'Protocol' }" @click="setPageName('Protocol')">{{ t('device.topBtn.protocol') }}</span>
      <span :class="{ active: pageName == 'Editor' }" @click="setPageName('Editor')">{{ t('device.topBtn.editor') }}</span>
      <span :class="{ active: pageName == 'Simulation' }" @click="setPageName('Simulation')">{{ t('device.topBtn.simulation') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OptionsBtnUp from './OptionsBtnUp.vue';
import OptionsBtnDown from './OptionsBtnDown.vue';
import { useI18n } from '@/hooks/web/useI18n';

export default defineComponent({
  name: 'TopBar',
  components: {
    OptionsBtnUp,
    OptionsBtnDown,
  },
  props: {
    pageName: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  emits: ['changePageName'],
  setup(_, { emit }) {
    const { t } = useI18n();

    const setPageName = (name: string) => {
      emit('changePageName', name);
    };

    return {
      t,
      setPageName,
    };
  },
});
</script>

<style lang="less" scoped>
.top-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  width: 100%;
  padding: 0 15px;
  height: 0;
  box-sizing: border-box;
}
.top-bar::before {
  z-index: 2;
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 20px;
  background: linear-gradient(180deg, #aaa, #555);
}

.bar-left {
  display: flex;
}

.nav-box {
  z-index: 2;
  height: 20px;
  line-height: 20px;
  span {
    padding: 0 7px;
    background-color: #aaa;
    border-right: solid 1px #aaa;
    cursor: pointer;
  }
  .active {
    background-color: #fff;
  }
}
</style>
