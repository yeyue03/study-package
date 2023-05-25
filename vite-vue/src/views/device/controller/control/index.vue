<template>
  <div class="scale-wrap">
    <div class="scale-box" :style="scaleStyle">
      <div class="control-box" :style="`width: ${rowWidth}`">
        <template v-for="(list, key) in controlObj" :key="key">
          <div class="control-row" @drop="rowDropEvent($event, key)" @dragover="dragoverEvent">
            <i :class="`iconfont ${key == 'temperature' ? 'icon-wendu' : 'icon-shidu'}`"></i>

            <template v-for="(item, index) in list" :key="item.id">
              <template v-if="item.btnType">
                <div class="reservation-wrap">
                  <div v-if="item.btnType == 'reservation' && key == 'temperature'" class="board reservation-board">
                    <div class="clock-timer">
                      <a-date-picker show-time v-model:value="item.date" />
                    </div>
                  </div>
                </div>
              </template>
              
              <div v-else class="board" draggable="true" @dragstart="boardDragStart($event, key, index)">
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
    </div>
  </div>

  <div class="delete-btn" @drop="deleteDropEvent" @dragover="dragoverEvent">
    <i class="iconfont icon-shanchu"></i>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, computed, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import CoordinateAxis from './CoordinateAxis.vue';
import { setControlChange } from '../useMitt';
import { listenerScaleOption, removeScaleListener } from '../useMitt';
import type { OptionsItem, ControlChildObj } from '../types';
import { log } from 'console';

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

    // 放置通用按钮
    const setGeneralBtn = (optionItem: OptionsItem, controlType: string) => {
      function addData() {
        controlObj[controlType].push({
          id: Math.random(),
          icon: optionItem.icon,
          date: undefined,
          loop: 1,
          btnType: optionItem.btnType
        })
      }
      addData();

      if (optionItem.btnType == 'reservation') { // 预约 因为一个预约Box同时跨了温度、湿度两行，所以另一个数组也要加数据，但湿度行不显示该盒子
        controlType = controlType == 'temperature' ? 'humidity' : 'temperature';
        addData();
      }

      setControlChange(controlObj);
      setRowWidth();
    }

    // 放置坐标版
    const setAxisBoard = (optionItem: OptionsItem, controlType: string) => {
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

      setControlChange(controlObj);
      setRowWidth();
    }
    
    // 拖拽释放事件 controlType: 所在面板类型
    const rowDropEvent = (e: any, controlType: string) => {
      e.preventDefault();
      let optionItem = e.dataTransfer.getData("optionItem"); // 按钮类型
      if (!optionItem) {
        return
      }

      optionItem = JSON.parse(optionItem);
      if (controlType != optionItem.controlType && !optionItem.btnType) {
        return message.warning('请选择对应类型按钮');
      }

      if (optionItem.btnType) { // 预约、循环等通用按钮
        setGeneralBtn(optionItem, controlType);
      } else {
        setAxisBoard(optionItem, controlType);
      }
    }

    const dragoverEvent = (e: Event) => {
      e.preventDefault();
    }

    const boardDragStart = (e: any, key: string, index: number) => {
      e.dataTransfer.setData("boardObj", JSON.stringify({ key, index }));
    };

    // board 拖拽到删除icon 处时触发删除事件
    const deleteDropEvent = (e: any) => {
      e.preventDefault();
      let boardObj = e.dataTransfer.getData("boardObj"); // 按钮类型
      if (!boardObj) {
        return
      }

      boardObj = JSON.parse(boardObj);
      deleteAxis(boardObj.key, boardObj.index);
    }

    const deleteAxis = (controlType: string, index: number) => {
      controlObj[controlType].splice(index, 1);
      setControlChange(controlObj);
      setRowWidth();
    }

    // 子组件值变更后同步变更父组件的值
    const changeAxis = (childObj: ControlChildObj, item: ControlChildObj) => {
      Object.assign(item, childObj);
      setControlChange(controlObj);
    }

    const rowWidth = ref('500px');
    const setRowWidth = () => {
      let maxLen = controlObj['temperature'].length;
      if (maxLen < controlObj['humidity'].length) {
        maxLen = controlObj['humidity'].length;
      }

      rowWidth.value = (80 + maxLen * 250 + 300) + 'px';
    }

    const scaleObj = reactive({
      width: 100,
      height: 100,
      scale: 1
    })
    const scaleStyle = computed(() => {
      return {
        width: `${scaleObj.width}%`,
        height: `${scaleObj.height}%`,
        transform: `scale(${scaleObj.scale})`,
      }
    })

    listenerScaleOption((type: string) => {
      if (type == 'amplify') { // 放大
        scaleObj.width *= 0.8;
        scaleObj.height *= 0.8;
        scaleObj.scale *= 1.25;

      } else if (type == 'reduce') { // 缩小
        scaleObj.width = scaleObj.width >= 100 ? 100 : scaleObj.width * 1.25;
        scaleObj.height = scaleObj.height >= 100 ? 100 : scaleObj.height * 1.25;
        scaleObj.scale *= 0.8;

      } else if (type == 'restore') { // 还原
        scaleObj.width = 100;
        scaleObj.height = 100;
        scaleObj.scale = 1;
      }
    })

    onBeforeUnmount(() => {
      removeScaleListener();
    })
    
    return {
      rowWidth,
      controlObj,
      scaleStyle,
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
@rowHeight: 214px;
@2x-rowHeight: 453px;

.scale-wrap {
  width: 100%;
  padding: 90px 0 50px;
}
.scale-box {
  transform-origin: left top;
  padding: 0 0 10px;
}
.control-box {
  min-width: 100%;
}
.control-row {
  position: relative;
  display: flex;
  align-items: center;
  height: @rowHeight;
  margin: 25px 0;

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

  // 预约板块
  .reservation-wrap {
    width: 170px;
    margin: 0 20px;
    height: @rowHeight;
  }
  .reservation-board {
    width: 100%;
    margin: 0;
    height: @2x-rowHeight;
  }
  .clock-timer {
    width: 100%;
    height: 100%;
    background: #333;
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
  height: @rowHeight;

  .gray-block {
    width: 100%;
    height: 40px;
    background: #ccc;
  }
}

.delete-btn {
  position: absolute;
  bottom: 25px;
  right: 25px;
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
