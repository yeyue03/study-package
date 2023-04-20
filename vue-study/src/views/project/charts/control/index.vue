<template>
  <div class="control-box">
    <template v-for="(list, key) in controlObj" :key="key">
      <div class="control-row" @drop="dropEvent($event, key)" @dragover="dragoverEvent">
        <i :class="`iconfont ${key == 'temperature' ? 'icon-wendu' : 'icon-shidu'}`"></i>

        <div class="board" v-for="(item, index) in list" :key="item.id">
          <div class="delete-btn" @click="deleteAxis(key, index)">
            <i class="iconfont icon-cha"></i>
          </div>
          <CoordinateAxis :axisObj="item" @changeAxis="changeAxis($event, item)" />
        </div>

        <div class="bg-row">
          <div class="gray-block"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';
import CoordinateAxis from './CoordinateAxis.vue';
import mitt from "@/utils/mitt.js";

export default defineComponent({
  name: 'ControlRoom',
  components: {
    CoordinateAxis
  },
  setup() {
    const controlObj = reactive({
      temperature: [
        // {
        //   id: 1,
        //   icon: 'icon-wendu',
        //   duration: 70,
        //   startValue: 20,
        //   endValue: 10,
        //   valueType: 'range',
        //   index: '01',
        // }
      ],
      humidity: [
        // {
        //   id: 2,
        //   icon: 'icon-shidu',
        //   duration: 70,
        //   startValue: 20,
        //   endValue: 10,
        //   valueType: 'range',
        //   index: '01',
        // }
      ],
    })
    
    // 拖拽释放事件 controlType: 所在面板类型
    const dropEvent = (e, controlType) => {
      e.preventDefault();
      let optionItem = e.dataTransfer.getData("optionItem"); // 按钮类型
      if (!optionItem) {
        return
      }

      optionItem = JSON.parse(optionItem);
      if (controlType != optionItem.controlType) {
        return message.warning('请选择对应类型按钮');
      }

      let startValue = 10;
      let endValue = 20;
      if (optionItem.valueType == 'constant') {
        endValue = 10;
      }

      let newIndex = controlObj[controlType].length + 1;
      newIndex = newIndex < 10 ? '0' + newIndex : newIndex;

      controlObj[controlType].push({
        id: Math.random(),
        icon: optionItem.icon,
        duration: 70,
        startValue,
        endValue,
        valueType: optionItem.valueType,
        index: newIndex,
      })

      mitt.emit('changeControlObj', controlObj);
    }

    const dragoverEvent = e => {
      e.preventDefault();
    }

    const deleteAxis = (controlType, index) => {
      controlObj[controlType].splice(index, 1);
      mitt.emit('changeControlObj', controlObj);
    }

    // 子组件值变更后同步变更父组件的值
    const changeAxis = (childObj, item) => {
      Object.assign(item, childObj);
      mitt.emit('changeControlObj', controlObj);
    }
    
    return {
      controlObj,
      dropEvent,
      dragoverEvent,
      deleteAxis,
      changeAxis
    }
  },
})
</script>

<style lang="less" scoped>
.control-box {
  width: 100%;
  padding: 90px 0 50px;
}
.control-row {
  position: relative;
  display: flex;
  align-items: center;
  height: 214px;
  margin: 10px 0;

  & > .iconfont {
    z-index: 2;
    width: 40px;
    height: 50px;
    margin-right: 40px;
    font-size: 30px;
    text-align: center;
    color: #f00;
    border: solid 1px #eee;
    border-left: none;
    background: #333;
    box-sizing: border-box;
    box-shadow: 2px 2px 10px 3px #333;
    border-radius: 3px;
  }
  .icon-shidu {
    color: skyblue;
  }

  .board {
    overflow: hidden;
    position: relative;
    z-index: 2;
    margin: 0 20px;
    border: solid 3px transparent;
    box-shadow: 2px 2px 5px 1px #333;
    border-radius: 5px;
    background-clip: padding-box;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to right, #fff, #fff), linear-gradient(to right, #ddd, #999);
  }
  .delete-btn {
    display: none;
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #999;
    cursor: pointer;

    .iconfont {
      position: relative;
      display: block;
      left: 1px;
      top: 2px;
      font-size: 12px;
      transform: scale(.6);
      -moz-transform: scale(.6);
      -webkit-transform: scale(.6);
      -o-transform: scale(.6);
    }
  }
  .board:hover .delete-btn {
    display: block;
  }
}
.bg-row {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 214px;

  .gray-block {
    width: 100%;
    height: 40px;
    background: #ccc;
  }
}
</style>
