<template>
  <div class="option-box">
    <div v-show="pageName == 'Editor'" class="option-scale">
      <template v-for="item in optionList" :key="item.type">
        <div class="option-item" draggable="true" @dragstart="dragStartEvent($event, item)">
          <i :class="`iconfont ${item.icon}`"></i>
          <div :class="{ line: true, rotate: item.valueType == 'range' }"></div>
        </div>
      </template>
    </div>

    <div v-show="pageName == 'Editor'" class="option-scale">
      <template v-for="item in loopBtnList" :key="item.type">
        <div class="option-item scale-btn" draggable="true" @dragstart="dragStartEvent($event, item)">
          <i :class="`iconfont ${item.icon}`"></i>
        </div>
      </template>
    </div>

    <div class="option-scale">
      <template v-for="item in scaleBtnList" :key="item.type">
        <div class="option-item scale-btn" @click="scaleOption(item.type)">
          <i :class="`iconfont ${item.icon}`"></i>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import type { OptionsItem } from '../types';
  import { setScaleOption } from '../useMitt';

  export default defineComponent({
    name: 'OptionsBtnDown',
    props: {
      pageName: {
        type: String,
        default: () => {
          return '';
        },
      },
    },
    setup() {
      const optionList = ref([
        {
          icon: 'icon-wendu',
          panelType: 'temperature',
          valueType: 'range',
          btnType: 'value',
        },
        {
          icon: 'icon-wendu',
          panelType: 'temperature',
          valueType: 'constant',
          btnType: 'value',
        },
      ]);

      const loopBtnList = ref([
        {
          name: '预约',
          icon: 'icon-yuyueguanli',
          btnType: 'reservation',
        },
        {
          name: '循环',
          icon: 'icon-xunhuan',
          btnType: 'loop',
        },
      ]);

      const scaleBtnList = ref([
        {
          name: '放大',
          icon: 'icon-fangda',
          type: 'amplify',
        },
        {
          name: '缩小',
          icon: 'icon-suoxiao',
          type: 'reduce',
        },
        {
          name: '还原',
          icon: 'icon-huanyuan',
          type: 'restore',
        },
      ]);

      const dragStartEvent = (e: any, item: OptionsItem) => {
        e.dataTransfer.setData('dragOptionItem', JSON.stringify(item));
      };

      const scaleOption = (type: string) => {
        setScaleOption(type);
      };

      return {
        optionList,
        loopBtnList,
        scaleBtnList,
        dragStartEvent,
        scaleOption,
      };
    },
  });
</script>

<style lang="less" scoped>
  .save-btn {
    position: relative;
    z-index: 2;
    width: 40px;
    height: 40px;
    margin: 3px 20px 0 3px;
    line-height: 40px;
    text-align: center;
    background: #333;
    border-top: solid 2px #aaa;
    border-left: solid 2px #aaa;
    border-bottom: solid 1px #555;
    border-right: solid 1px #555;
    box-shadow: -2px -2px 3px 1px #333;
    cursor: pointer;

    .iconfont {
      font-size: 28px;
    }
  }

  .option-box {
    position: relative;
    display: flex;
  }
  .option-item {
    position: relative;
    z-index: 2;
    width: 50px;
    height: 40px;
    margin: 3px 0 0 3px;
    background: #333;
    border-top: solid 2px #aaa;
    border-left: solid 2px #aaa;
    border-bottom: solid 1px #555;
    border-right: solid 1px #555;
    box-shadow: -2px -2px 3px 1px #333;
    cursor: pointer;

    .iconfont {
      font-size: 26px;
      line-height: 40px;
    }
    .icon-shidu {
      font-size: 22px;
    }
    .line {
      position: absolute;
      top: 12px;
      right: 5px;
      width: 23px;
      height: 0;
      border-top: solid 2px yellow;
    }
    .rotate {
      top: 18px;
      right: 1px;
      width: 28px;
      transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
    }
  }

  .option-scale {
    display: flex;
    margin-left: 10px;
  }
  .scale-btn {
    width: 40px;
    text-align: center;

    .iconfont {
      font-size: 28px;
    }
  }
</style>
