<template>
  <div class="scale-wrap">
    <div class="scale-box" :style="scaleStyle">
      <div class="control-box" :style="`width: ${rowWidth}`">
        <template v-for="(list, key) in controlObj" :key="key">
          <div class="control-row" @drop="rowDropEvent($event, key)" @dragover="dragoverEvent">
            <i :class="`iconfont ${key == 'temperature' ? 'icon-wendu' : 'icon-shidu'}`"></i>

            <transition-group tag="div" class="board-row">
              <template v-for="(item, index) in list" :key="item.id">
                <template v-if="item.btnType != 'value'">
                  <!-- 预约 -->
                  <div v-if="item.btnType == 'reservation'" class="board reservation-board" draggable="true" @dragstart="boardDragStart($event, key, index, item)" @drop="boardDrop(key, index, item)" @dragend="boardDragEnd()">
                    <div class="cha-btn" @click="deleteBoard(key, index, item.btnType)">
                      <i class="iconfont icon-cha"></i>
                    </div>
                    <div class="clock-timer">
                      <div class="tag-box">
                        <span class="tag-span">CLOCK TIMER</span>
                      </div>
                      <a-date-picker show-time v-model:value="item.date" valueFormat="YYYY-MM-DD HH:mm:ss" @change="changeDate($event, index)" />
                    </div>
                  </div>

                  <!-- 循环 -->
                  <div v-else-if="item.btnType == 'loop'" class="board loop-board" draggable="true" @dragstart="boardDragStart($event, key, index, item)" @drop="boardDrop(key, index, item)" @dragend="boardDragEnd()">
                    <div class="cha-btn" @click="deleteBoard(key, index, item.btnType)">
                      <i class="iconfont icon-cha"></i>
                    </div>
                    <div class="loop-box">
                      <div class="tag-box">
                        <span class="tag-span">{{ item.isRightLoop ? 'LOOP' : 'JUMP TARGET' }}</span>
                      </div>
                      <i :class="`iconfont ${item.icon}`"></i>
                      <div class="tag-box">
                        <template v-if="item.isRightLoop">
                          <span v-if="!item.isshowLoopInput" class="loop-span" @click="showLoopInput(item, true, key)">{{ item.loop }}x</span>
                          <a-input-number v-else class="loop-span" :min="1" :max="100" :step="1" :precision="0" v-focus v-model:value="item.loop" @blur="showLoopInput(item, false, key)" />
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
                
                <!-- 坐标轴板块 -->
                <div v-else class="board" draggable="true" @dragstart="boardDragStart($event, key, index, item)" @drop="boardDrop(key, index, item)" @dragend="boardDragEnd()">
                  <div class="cha-btn" @click="deleteBoard(key, index)">
                    <i class="iconfont icon-cha"></i>
                  </div>
                  <CoordinateAxis :axisObj="item" @changeAxis="changeAxis($event, item)" />
                </div>
              </template>
            </transition-group>

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
import type { OptionsItem, ControlChildObj, DraggingObj } from '../types';

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
      function addReservationData() {
        controlObj[controlType].push({
          id: Math.random(),
          icon: optionItem.icon,
          date: undefined,
          btnType: optionItem.btnType
        })
      }

      function addLoopData(bool: boolean, timestamp: number) {
        controlObj[controlType].push({
          id: Math.random(),
          icon: bool ? 'icon-jiantou16' : 'icon-jiantou10',
          loop: 1,
          isRightLoop: bool,
          btnType: optionItem.btnType,
          timestamp,
          loopChilds: []
        })
      }

      if (optionItem.btnType == 'reservation') { // 预约 因为一个预约Box同时跨了温度、湿度两行，所以另一个数组也要加数据，但湿度行不显示该盒子
        addReservationData();

      } else if (optionItem.btnType == 'loop') { // 循环 插入左框、右框
        const timestamp = (new Date()).getTime();
        addLoopData(false, timestamp);
        addLoopData(true, timestamp);
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
        btnType: 'value'
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
      if (controlType != optionItem.controlType && optionItem.btnType == 'value') {
        return message.warning('请选择对应类型按钮');
      }

      if (optionItem.btnType != 'value') { // 预约、循环等通用按钮
        setGeneralBtn(optionItem, controlType);
      } else {
        setAxisBoard(optionItem, controlType);
      }
    }

    const dragoverEvent = (e: Event) => {
      e.preventDefault();
    }

    let draggingObj: DraggingObj = {};
    const boardDragStart = (e: any, controlType: string, index: number, item: ControlChildObj) => {
      draggingObj = { controlType, index, btnType: item.btnType, id: item.id };
      e.dataTransfer.setData("boardObj", JSON.stringify(draggingObj));
    };

    // 拖拽排序 放下时运行
    const boardDrop = (controlType: string, index: number, item: ControlChildObj) => {
      if (!draggingObj.id || draggingObj.id === item.id) {
        return
      }

      controlObj[controlType].splice(index, 0, ...controlObj[controlType].splice(draggingObj.index, 1));
    };

    const boardDragEnd = () => {
      draggingObj = {};
    }

    // board 拖拽到删除icon 处时触发删除事件
    const deleteDropEvent = (e: any) => {
      e.preventDefault();
      let boardObj = e.dataTransfer.getData("boardObj"); // 按钮类型
      if (!boardObj) {
        return
      }

      boardObj = JSON.parse(boardObj);
      deleteBoard(boardObj.controlType, boardObj.index, boardObj.btnType);
    }

    const deleteBoard = (controlType: string, index: number, btnType: string) => {
      if (btnType == 'value') {
        controlObj[controlType].splice(index, 1);
        setControlChange(controlObj);
        setRowWidth();

      } else if (btnType == 'reservation') { // 预约
        controlObj[controlType].splice(index, 1);

      } else if (btnType == 'loop') { // 循环
        const loopItem = controlObj[controlType][index];
        const timestamp = loopItem.timestamp;
        controlObj[controlType].splice(index, 1);
        
        const findIndex = controlObj[controlType].findIndex((item: ControlChildObj) => item.timestamp == timestamp);
        controlObj[controlType].splice(findIndex, 1);
      }
      
    }

    // 子组件值变更后同步变更父组件的值
    const changeAxis = (childObj: ControlChildObj, item: ControlChildObj) => {
      Object.assign(item, childObj);
      setControlChange(controlObj);
    }

    // 更改预约值，同步修改湿度预约值
    const changeDate = (date: string | null, index: number) => {
      controlObj['humidity'][index]['date'] = date;
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

    // 是否显示循环次数输入框
    const showLoopInput = (item: ControlChildObj, bool: boolean, controlType: string) => {
      item.isshowLoopInput = bool;
      if (!bool) { // 前后loop保持一致
        const findIndex = controlObj[controlType].findIndex((obj: ControlChildObj) => obj.timestamp == item.timestamp);
        controlObj[controlType][findIndex].loop = item.loop;
      }
    }

    onBeforeUnmount(() => {
      removeScaleListener();
    })
    
    return {
      rowWidth,
      controlObj,
      scaleStyle,
      rowDropEvent,
      boardDragStart,
      boardDrop,
      boardDragEnd,
      deleteDropEvent,
      dragoverEvent,
      deleteBoard,
      changeAxis,
      changeDate,
      showLoopInput
    }
  },
  directives: {
    focus: {
      mounted: (el: any) => el.querySelector("input").focus()
    }
  }
})
</script>

<style lang="less" scoped>
@rowHeight: 214px;
@boardBgColor: #333;

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
    background: @boardBgColor;
    box-sizing: border-box;
    box-shadow: 2px 2px 10px 3px @boardBgColor;
    border-radius: 3px;
  }
  .icon-shidu {
    color: skyblue;
  }

  .board {
    width: 210px;
    height: @rowHeight;
    overflow: hidden;
    position: relative;
    z-index: 2;
    margin: 0 20px;
    border: solid 3px transparent;
    box-shadow: 2px 2px 5px 1px @boardBgColor;
    border-radius: 5px;
    background-clip: padding-box;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to right, #fff, #fff), linear-gradient(to right, #ddd, #999);
    transition: all linear 0.3s;
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
  .board-row {
    position: relative;
    display: flex;
    align-items: center;
  }

  // 预约板块
  .reservation-board {
    width: 170px;
    margin: 0 20px;
    height: @rowHeight;
  }
  .clock-timer {
    width: 100%;
    height: 100%;
    background: @boardBgColor;
  }

  // 循环板块
  .loop-board {
    width: 120px;
    margin: 0 20px;
    height: @rowHeight;
  }
  .loop-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    background: @boardBgColor;
  }
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
  .loop-span {
    width: 80px;
    margin: 0 auto;
    text-align: center;
  }
  .ant-input-number-input {
    text-align: center;
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
