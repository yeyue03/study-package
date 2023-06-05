<template>
  <div class="scale-wrap">
    <div class="now-shandard">当前标准：{{ standardTypeObj[standardType] || '' }}</div>
    <div class="scale-box" :style="scaleStyle">
      <div class="control-box" :style="`width: ${rowWidth}`">
        <div
          class="control-row" 
          @drop="rowDropEvent($event)"
          @dragover="dragoverEvent"
        >
          <transition-group tag="div" class="board-row">
            <template v-for="(item, index) in settingsArr" :key="item.id">
              <div
                v-if="item.btnType != 'reservation'"
                class="board-wrap"
                :draggable="true"
                @dragstart="boardDragStart($event, index, item)"
                @drop="boardDrop(index, item)"
                @dragend="boardDragEnd()"
                :style="{height: boardHeight}"
              >
                <div class="cha-btn" @click="deleteBoard(index, item.btnType, item.timestamp)">
                  <i class="iconfont icon-cha"></i>
                </div>
                
                <!-- 循环 -->
                <template v-if="item.btnType == 'loop'">
                  <PanelLoop
                    :panelObj="item"
                    :rowLen="needPanelRowList.length"
                    @changePanel="changePanel($event, item)"
                  />
                </template>
                
                <!-- 坐标轴板块 -->
                <template v-else>
                  <template v-for="panelType in needPanelRowList" :key="panelType">
                    <PanelCoordinateAxis
                      :axisObj="item[panelType]"
                      @changePanel="changePanel($event, item[panelType], item)"
                    />
                  </template>
                </template>
              </div>

              <!-- 预约 -->
              <div v-else class="board-wrap" :style="{height: boardHeight}">
                <div class="cha-btn" @click="deleteBoard(index, item.btnType, item.timestamp)">
                  <i class="iconfont icon-cha"></i>
                </div>

                <PanelReservation
                  :panelObj="item"
                  :rowLen="needPanelRowList.length"
                  @changePanel="changePanel($event, item)"
                />
              </div>
            </template>
          </transition-group>

          <!-- 背景灰线 -->
          <div class="control-bg-box" :style="{height: boardHeight}">
            <template v-for="panelType in needPanelRowList" :key="panelType">
              <div class="bg-row">
                <i v-if="panelType == 'temperature'" class="iconfont icon-wendu"></i>
                <i v-else-if="panelType == 'humidity'" class="iconfont icon-shidu"></i>
                <i v-else class="iconfont icon-guangzhao"></i>
                <div class="gray-block"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="delete-btn" @drop="deleteDropEvent" @dragover="dragoverEvent">
    <i class="iconfont icon-shanchu"></i>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  reactive,
  computed,
  onBeforeUnmount,
  inject,
  watch,
} from "vue";
import { message } from "ant-design-vue";
import { nanoid } from "nanoid";
import PanelCoordinateAxis from "./PanelCoordinateAxis.vue";
import PanelReservation from "./PanelReservation.vue";
import PanelLoop from "./PanelLoop.vue";
import { setControlChange } from "../useMitt";
import {
  listenerScaleOption,
  removeScaleListener,
  listenerReplacePlan,
  listenerStandardType
} from "../useMitt";
import type { OptionsItem, PanelChildObj, DraggingObj } from "../types";

export default defineComponent({
  name: "ControlRoom",
  components: {
    PanelCoordinateAxis,
    PanelReservation,
    PanelLoop,
  },
  setup() {
    const needPanelRowList = ref(['temperature', 'humidity', 'beam']); // 该设备含有的面板类似 温度、湿度、光照
    const panelObj = reactive({
      temperature: [],
      humidity: [],
    });
    const settingsArr = ref([]);

    const injectDeviceObj = inject("changeDeviceObj", {});
    watch(injectDeviceObj, (newVal) => {
      console.log(">>>>>>>>>>>>>>>> 设备变更：", newVal);
      let _arr = [];
      if (newVal.isTemperature) {
        _arr.push('temperature');
      }
      if (newVal.isHumidity) {
        _arr.push('humidity');
      }
      if (newVal.isBeam) {
        _arr.push('beam');
      }
      needPanelRowList.value = _arr;
    });

    const injectDevicePlanDetail = inject('changeDevicePlanDetail', {});
    watch(injectDevicePlanDetail, (newObj) => {
      console.log("== 详情inject: ", newObj);
      settingsArr.value = [];
      if (newObj.settings) {
        settingsArr.value = JSON.parse(newObj.settings);
        setControlChange(settingsArr.value);
        setRowWidth();
      }
    })

    const boardHeight = computed(() => {
      return (needPanelRowList.value.length * 214 + 20 + (needPanelRowList.value.length - 1) * 20) + 'px';
    })

    // 当前标准
    const standardType = ref('temperature');
    const standardTypeObj = reactive({
      temperature: '温度',
      humidity: '湿度',
      both: '温湿度',
    })
    listenerStandardType((type: string) => {
      standardType.value = type;
    });

    // 用模板替换当前计划
    listenerReplacePlan((settings: string) => {
      if (!settings) {
        return;
      }

      const settingsObj = JSON.parse(settings);
      Object.assign(panelObj, settingsObj);
      console.log("=== settingsObj: ", settingsObj);

      setControlChange(panelObj);
    });

    // 放置通用按钮
    const setGeneralBtn = (optionItem: OptionsItem) => {
      const _arr = settingsArr.value;
      if (optionItem.btnType == "reservation") { // 插入预约框
        if (_arr[0] && _arr[0].btnType == 'reservation') {
          return message.warning('已有预约框')

        } else {
          _arr.unshift({
            id: nanoid(),
            icon: optionItem.icon,
            date: undefined,
            btnType: optionItem.btnType,
          })
        }

      } else if (optionItem.btnType == "loop") { // 循环 插入左框、右框
        const timestamp = new Date().getTime();
        _arr.push({
          id: nanoid(),
          icon: "icon-jiantou10",
          loop: 1,
          isRightLoop: false,
          btnType: optionItem.btnType,
          timestamp
        }, {
          id: nanoid(),
          icon: "icon-jiantou16",
          loop: 1,
          isRightLoop: true,
          btnType: optionItem.btnType,
          timestamp
        })
      }

      setControlChange(settingsArr.value);
      setRowWidth();
    };

    // 放置坐标版
    const setAxisBoard = (optionItem: OptionsItem) => {
      // needPanelRowList = ref(['temperature', 'humidity', 'beam'])
      // settingsArr.value
      let startValue = 10;
      let endValue = 20;
      if (optionItem.valueType == "constant") {
        endValue = 10;
      }

      let newIndex = settingsArr.value.length + 1;
      newIndex = newIndex < 10 ? "0" + newIndex : newIndex;
      
      let _obj = {
        id: nanoid(),
        btnType: 'value'
      };
      const iconObj = {
        temperature: 'icon-wendu',
        humidity: 'icon-shidu',
        beam: 'icon-guangzhao',
      }
      for (const panelType of needPanelRowList.value) {
        _obj[panelType] = {
          id: nanoid(),
          icon: iconObj[panelType],
          duration: 1,
          startValue,
          endValue,
          powerSize: optionItem.valueType == 'range' ? '1' : '',
          valueType: optionItem.valueType,
          index: newIndex,
          bandMax: 0,
          bandMin: 0,
          panelType,
          btnType: "value",
        }
      }

      settingsArr.value.push(_obj);

      console.log("=== settingsArr: ", settingsArr.value);
      setControlChange(settingsArr.value);
      setRowWidth();
    };

    // 拖拽释放事件 panelType: 所在面板类型
    const rowDropEvent = (e: any) => {
      e.preventDefault();
      let optionItem = e.dataTransfer.getData("dragOptionItem"); // 按钮类型
      if (!optionItem) {
        return;
      }

      optionItem = JSON.parse(optionItem);
      if (optionItem.btnType == "value") {
        setAxisBoard(optionItem);
      } else { // 预约、循环等通用按钮
        setGeneralBtn(optionItem);
      }
    };

    const dragoverEvent = (e: Event) => {
      e.preventDefault();
    };

    let draggingObj: DraggingObj = {};
    /**
     * @param {Object} e 当前事件
     * @param {number} index 当前数组索引
     * @param {Object} item 当前数组的项
     */
    const boardDragStart = (e: any, index: number, item: PanelChildObj) => {
      draggingObj = {
        index,
        id: item.id,
        btnType: item.btnType,
        timestamp: item.timestamp
      };

      e.dataTransfer.setData("boardObj", JSON.stringify(draggingObj));
    };

    // 拖拽排序 放下时运行（规律：往左移插入元素左侧，往右移插入元素右侧）
    const boardDrop = (dropIndex: number, item: PanelChildObj) => {
      if (!draggingObj.id || draggingObj.id === item.id) {
        return;
      }

      const boardList = settingsArr.value;
      // 判断循环box拖动是否合理
      if (draggingObj.btnType == 'loop') {
        const dragIndex = draggingObj.index;
        let sliceArr = boardList.slice(dropIndex, dragIndex);
        if (dragIndex < dropIndex) { // 右移
          sliceArr = boardList.slice(dragIndex + 1, dropIndex + 1);
        }

        for (const item of sliceArr) {
          if (item.btnType == 'loop') {
            return message.warning('不可拖动')
          }
        }
      }

      const dragSliceItem = boardList.splice(draggingObj.index, 1)[0];
      boardList.splice(dropIndex, 0, dragSliceItem);
    };

    const boardDragEnd = () => {
      draggingObj = {};
    };

    // board 拖拽到删除icon 处时触发删除事件
    const deleteDropEvent = (e: any) => {
      e.preventDefault();
      let boardObj = e.dataTransfer.getData("boardObj"); // 按钮类型
      if (!boardObj) {
        return;
      }

      boardObj = JSON.parse(boardObj);
      deleteBoard(boardObj.index, boardObj.btnType, boardObj.timestamp);
    };

    const deleteBoard = (index: number, btnType: string, timestamp: number) => {
      console.log("=== index: ", index, btnType, timestamp);
      console.log("=== settingsArr: ", JSON.parse(JSON.stringify(settingsArr.value)));
      
      if (btnType == "loop") { // 循环
        settingsArr.value.splice(index, 1);

        const findIndex = settingsArr.value.findIndex((item: PanelChildObj) => item.timestamp == timestamp);
        settingsArr.value.splice(findIndex, 1);

      } else {
        settingsArr.value.splice(index, 1);
      }

      setRowWidth();
    };

    // 子组件值变更后同步变更父组件的值
    /**
     * @param {Object} childObj 更改后的对象
     * @param {Object} item 原先的对象
     * @param {Object} parentItem 父对象，只有温度、湿度、光照会有
     */
    const changePanel = (childObj: PanelChildObj, item: PanelChildObj, parentItem: any) => {
      Object.assign(item, childObj);

      // 前后loop保持一致
      if (childObj.btnType == "loop" && childObj.isRightLoop) {
        const _setArr = settingsArr.value;
        const findIndex = _setArr.findIndex((obj: PanelChildObj) => obj.timestamp == item.timestamp);
        _setArr[findIndex].loop = item.loop;

      } else if (parentItem) {
        // 同一列中温度、湿度、光照时长、功率同一
        for (const panelType of needPanelRowList.value) {
          parentItem[panelType]['powerSize'] = childObj['powerSize'];
          parentItem[panelType]['duration'] = childObj['duration'];
        }
      }
      setControlChange(settingsArr.value);
    };

    const rowWidth = ref("500px");
    const setRowWidth = () => {
      let _width = 80;
      for (const item of settingsArr.value) {
        if (item.btnType == 'value') {
          _width += 370;
        } else if (item.btnType == 'reservation') {
          _width += 210;
        } else if (item.btnType == 'loop') {
          _width += 160;
        }
      }
      _width += 300
      rowWidth.value = _width + "px";
    };

    const scaleObj = reactive({
      width: 100,
      height: 100,
      scale: 1
    })
    const scaleStyle = computed(() => {
      const _width = scaleObj.width >= 100 ? 100 : scaleObj.width;
      const _height = scaleObj.width >= 100 ? 100 : scaleObj.width;
      return {
        width: `${_width}%`,
        height: `${_height}%`,
        transform: `scale(${scaleObj.scale})`,
      }
    })

    listenerScaleOption((type: string) => {
      if (type == 'amplify') { // 放大
        scaleObj.width *= 0.8;
        scaleObj.height *= 0.8;
        scaleObj.scale *= 1.25;

      } else if (type == 'reduce') { // 缩小
        scaleObj.width = scaleObj.width * 1.25;
        scaleObj.height = scaleObj.height * 1.25;
        scaleObj.scale *= 0.8;

      } else if (type == 'restore') { // 还原
        scaleObj.width = 100;
        scaleObj.height = 100;
        scaleObj.scale = 1;
      }
    })

    onBeforeUnmount(() => {
      removeScaleListener();
    });

    return {
      needPanelRowList,
      boardHeight,
      rowWidth,
      standardType,
      standardTypeObj,
      settingsArr,
      panelObj,
      scaleStyle,
      rowDropEvent,
      boardDragStart,
      boardDrop,
      boardDragEnd,
      deleteDropEvent,
      dragoverEvent,
      deleteBoard,
      changePanel,
    };
  },
});
</script>

<style lang="less" scoped>
@boardBgColor: #333;

.scale-wrap {
  width: 100%;
  padding: 90px 0 50px;
}
.now-shandard {
  width: 100%;
  text-align: center;
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
  margin: 25px 0;

  .board {
    width: 215px;
    height: 100%;
    // overflow: hidden;
    position: relative;
    border: solid 3px transparent;
    box-shadow: 2px 2px 5px 1px @boardBgColor;
    border-radius: 5px;
    background-clip: padding-box;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to right, #fff, #fff), linear-gradient(to right, #ddd, #999);
  }
  .board-row {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 70px;
  }
}
.board-wrap {
  z-index: 2;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 20px;
  transition: all linear 0.3s;

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
      transform: scale(0.6);
      -moz-transform: scale(0.6);
      -webkit-transform: scale(0.6);
      -o-transform: scale(0.6);
    }
  }
}
.board-wrap:hover {
  background: rgba(255, 255, 255, .2);
  .cha-btn {
    display: block;
  }
}

.control-bg-box {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.bg-row {
  display: flex;
  align-items: center;
  width: 100%;

  & > .iconfont {
    z-index: 2;
    width: 40px;
    height: 50px;
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
  .icon-guangzhao {
    color: #ffff00;
  }

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
