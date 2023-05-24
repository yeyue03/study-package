<template>
  <div class="option-box">
    <template v-for="item in optionList" :key="item.type">
      <div class="option-item scale-btn" @click="choseOption(item.type)">
        <i :class="`iconfont ${item.icon}`"></i>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { message } from 'ant-design-vue';
import { listenerControlChange } from '../useMitt';
import type { ControlObj } from '../types';

export default defineComponent({
  name: 'UpOptionsBtn',
  setup() {
    const optionList = ref([
      {
        name: '保存',
        icon: 'icon-save',
        type: 'save',
      },
      {
        name: '停止',
        icon: 'icon-zanting',
        type: 'stop',
      },
      {
        name: '启动',
        icon: 'icon-start',
        type: 'start',
      },
      {
        name: '方案',
        icon: 'icon-wj-fa',
        type: 'scheme',
      },
      {
        name: '标准',
        icon: 'icon-biaozhun',
        type: 'standard',
      },
    ])

    const saveDataObj = ref();
    listenerControlChange((obj: ControlObj) => {
      saveDataObj.value = obj;
    })

    const choseOption = (type: string) => {
      message.success(type);
      if (type == 'save') {
        console.log('保存的值：', saveDataObj.value)
      }
    }
    
    return {
      optionList,
      choseOption,
    }
  },
})
</script>

<style lang="less" scoped>
.option-box {
  position: relative;
  display: flex;
  margin-right: 10px;
}
.option-item {
  position: relative;
  z-index: 2;
  width: 40px;
  height: 40px;
  margin: 3px 0 0 3px;
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
</style>
