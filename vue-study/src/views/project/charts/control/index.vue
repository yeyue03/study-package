<template>
  <div class="control-box" :style="`width: ${rowWidth}`">
    <template v-for="(list, key) in controlObj" :key="key">
      <div class="control-row" @drop="rowDropEvent($event, key)" @dragover="dragoverEvent">
        <i :class="`iconfont ${key == 'temperature' ? 'icon-wendu' : 'icon-shidu'}`"></i>

        <template v-for="(item, index) in list" :key="item.id">
          <div class="board" draggable="true" @dragstart="boardDragStart($event, key, index)">
            <div class="cha-btn" @click="deleteAxis(key, index)">
              <i class="iconfont icon-cha"></i>
            </div>
            <CoordinateAxis :axisObj="item" @changeAxis="changeAxis($event, item)" />
          </div>
        </template>

        <div class="bg-row">
          <div class="gray-block"></div>
        </div>
      </div>
    </template>
  </div>

  <div class="delete-btn" @drop="deleteDropEvent" @dragover="dragoverEvent">
    <i class="iconfont icon-shanchu"></i>
  </div>
</template>

<script>
import { ref, defineComponent, reactive } from 'vue';
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
      temperature: [],
      humidity: [],
    })
    
    // 拖拽释放事件 controlType: 所在面板类型
    const rowDropEvent = (e, controlType) => {
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
      setRowWidth();
    }

    const dragoverEvent = e => {
      e.preventDefault();
    }

    const boardDragStart = (e, key, index) => {
      e.dataTransfer.setData("boardObj", JSON.stringify({ key, index }));
    };

    // board 拖拽到删除icon 处时触发删除事件
    const deleteDropEvent = e => {
      e.preventDefault();
      let boardObj = e.dataTransfer.getData("boardObj"); // 按钮类型
      if (!boardObj) {
        return
      }

      boardObj = JSON.parse(boardObj);
      deleteAxis(boardObj.key, boardObj.index);
    }

    const deleteAxis = (controlType, index) => {
      controlObj[controlType].splice(index, 1);
      mitt.emit('changeControlObj', controlObj);
      setRowWidth();
    }

    // 子组件值变更后同步变更父组件的值
    const changeAxis = (childObj, item) => {
      Object.assign(item, childObj);
      mitt.emit('changeControlObj', controlObj);
    }

    const rowWidth = ref('500px');
    const setRowWidth = () => {
      let maxLen = controlObj['temperature'].length;
      if (maxLen < controlObj['humidity'].length) {
        maxLen = controlObj['humidity'].length;
      }

      rowWidth.value = (80 + maxLen * 250 + 300) + 'px';
    }
    
    return {
      rowWidth,
      controlObj,
      rowDropEvent,
      boardDragStart,
      deleteDropEvent,
      dragoverEvent,
      deleteAxis,
      changeAxis
    }
  },
})
</script>

<style lang="less" scoped>
.control-box {
  min-width: 100%;
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
    width: 210px;
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
  .cha-btn {
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
  .board:hover .cha-btn {
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

.delete-btn {
  position: absolute;
  bottom: 25px;
  right: 5px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  .iconfont {
    font-size: 50px;
    color: #fff;
  }
}
</style>
