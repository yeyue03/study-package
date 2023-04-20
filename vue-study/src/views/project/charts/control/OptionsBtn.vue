<template>
  <div class="option-box">
    <template v-for="item in optionList" :key="item.type">
      <div class="option-item" draggable="true" @dragstart="dragStartEvent($event, item)">
        <i :class="`iconfont ${item.icon}`"></i>
        <div :class="{ 'line': true, 'rotate': item.valueType == 'range' }"></div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'OptionsBtn',
  setup() {
    const optionList = ref([
      {
        icon: 'icon-wendu',
        controlType: 'temperature',
        valueType: 'range'
      },
      {
        icon: 'icon-wendu',
        controlType: 'temperature',
        valueType: 'constant'
      },
      {
        icon: 'icon-shidu',
        controlType: 'humidity',
        valueType: 'range'
      },
      {
        icon: 'icon-shidu',
        controlType: 'humidity',
        valueType: 'constant'
      },
    ])
    
    const dragStartEvent = (e, item) => {
      e.dataTransfer.setData("optionItem", JSON.stringify(item));
    };
    
    return {
      optionList,
      dragStartEvent
    }
  },
})
</script>

<style lang="less" scoped>
.option-box {
  position: relative;
  display: flex;
  padding-left: 15px;
}
.option-box::before {
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
    font-size: 28px;
    line-height: 40px;
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
</style>
