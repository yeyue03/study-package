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
              <!-- 拖拽提示线条 -->
              <div v-if="willDropIndex === index" class="drop-line" :style="{height: boardHeight}"></div>

              <div
                v-if="item.btnType != 'reservation'"
                class="board-wrap"
                :draggable="true"
                @dragstart="boardDragStart($event, index, item)"
                @dragover.stop="dragoverBoardEvent($event, index)"
                @drop.stop="boardDrop($event, index, item)"
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
                    @changePanel="changePanel($event, item, null)"
                  />
                </template>
                
                <!-- 坐标轴板块 -->
                <template v-else>
                  <template v-for="panelType in needPanelRowList" :key="panelType">
                    <template v-if="item[panelType]">
                      <PanelCoordinateAxis
                        :axisObj="item[panelType]"
                        @changePanel="changePanel($event, item[panelType], item)"
                      />
                    </template>
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
                  @changePanel="changePanel($event, item, null)"
                />
              </div>

              <!-- 不加此判断的话，移动到最后一个box时，移动提示蓝线无法出现 -->
              <div v-if="index == settingsArr.length-1 && willDropIndex === settingsArr.length" class="drop-line" :style="{height: boardHeight}"></div>

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
import { OptionsItem, SettingsArrItem, DraggingObj } from "../types";
import dayjs from 'dayjs';

export default defineComponent({
  name: "ControlRoom",
  components: {
    PanelCoordinateAxis,
    PanelReservation,
    PanelLoop,
  },
  setup() {
    const needPanelRowList: any = inject("changePanelRowList", ['temperature', 'humidity', 'beam']); // 该设备含有的面板类似 温度、湿度、光照
    const defaultFormat = 'YYYY-MM-DD HH:mm';
    const settingsArr: any = ref([]);

    const injectDeviceObj: any = inject("changeDeviceObj", {});

    const injectDevicePlanDetail = inject('changeDevicePlanDetail', {});
    watch(injectDevicePlanDetail, (newObj: any) => {
      settingsArr.value = [];
      if (newObj.settings) {
        settingsArr.value = JSON.parse(newObj.settings);
      }
      setControlChange(settingsArr.value);
      setRowWidth();
    })

    const changePageName: any = inject('changePageName');

    const boardHeight = computed(() => {
      return (needPanelRowList.value.length * 214 + 20 + (needPanelRowList.value.length - 1) * 20) + 'px';
    })

    // 当前标准
    const standardType = ref('temperature');
    const standardTypeObj: any = reactive({
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

      settingsArr.value = JSON.parse(settings);
      
      setControlChange(settingsArr.value);
      setRowWidth();
    });

    // 放置通用按钮，dropIndex 存在则把新增的元素放在当前索引后面
    const setGeneralBtn = (optionItem: OptionsItem, dropIndex: number | void) => {
      const _setArr = settingsArr.value;
      if (optionItem.btnType == "reservation") { // 插入预约框
        if (_setArr[0] && _setArr[0].btnType == 'reservation') {
          return message.warning('已有预约框')

        } else {
          const _date: string = dayjs((new Date()).getTime() + 60000).format(defaultFormat);

          _setArr.unshift({
            id: nanoid(),
            icon: optionItem.icon,
            date: _date,
            btnType: optionItem.btnType,
          })
        }

      } else if (optionItem.btnType == "loop") { // 循环 插入左框、右框
        const timestamp = new Date().getTime();
        const newArr = [{
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
        }]

        if (dropIndex) {
          const lastItem = _setArr.slice(0, dropIndex + 1).filter((item: SettingsArrItem) => item.btnType == 'loop').pop();
          if (lastItem && !lastItem.isRightLoop) {
            return message.warning('此处不可插入循环框');
          } else {
            _setArr.splice(dropIndex + 1, 0, ...newArr);
          }

        } else {
          _setArr.push(...newArr);
        }
      }

      setControlChange(settingsArr.value);
      setRowWidth();
    };

    // 放置坐标版，dropIndex 存在则把新增的元素放在当前索引后面
    const setAxisBoard = (optionItem: OptionsItem, dropIndex: number | void) => {
      let startValue = 10;
      let endValue = 20;
      if (optionItem.valueType == "constant") { // 恒定值
        endValue = startValue;
      }

      let _len: number = settingsArr.value.length + 1;
      const serialNumber = _len < 10 ? "0" + _len : _len;
      
      let _obj: any = {
        id: nanoid(),
        btnType: 'value',
        duration: 1,
        powerSize: optionItem.valueType == 'range' ? '1' : ''
      };
      const iconObj: any = {
        temperature: 'icon-wendu',
        humidity: 'icon-shidu',
        beam: 'icon-guangzhao',
        powerSize: optionItem.valueType == 'range' ? '1' : ''
      }

      // 获取前一个坐标轴元素
      let lastItem: any = null;
      if (dropIndex) {
        lastItem = settingsArr.value.slice(0, dropIndex + 1).filter((item: SettingsArrItem) => item.btnType == 'value').pop();
      } else {
        lastItem = settingsArr.value.filter((item: SettingsArrItem) => item.btnType == 'value').pop();
      }

      for (const panelType of needPanelRowList.value) {
        if (lastItem) {
          startValue = lastItem[panelType]['endValue']; // 后一个坐标轴开始值等于前一个坐标轴结束值

        } else { // 第一个axis box开始值取设备实际值
          startValue = injectDeviceObj.value[panelType]
        }

        if (optionItem.valueType == "constant") { // 恒定值
          endValue = startValue;
        }

        _obj[panelType] = {
          id: nanoid(),
          icon: iconObj[panelType],
          duration: 1,
          startValue,
          endValue,
          powerSize: optionItem.valueType == 'range' ? '1' : '',
          valueType: optionItem.valueType,
          serialNumber,
          bandMax: 0,
          bandMin: 0,
          panelType,
          btnType: "value",
        }
      }

      if (dropIndex) {
        settingsArr.value.splice(dropIndex + 1, 0, _obj);
      } else {
        settingsArr.value.push(_obj);
      }

      setControlChange(settingsArr.value);
      setRowWidth();
    };

    // 拖拽释放事件 panelType: 所在面板类型
    const rowDropEvent = (e: any, dropIndex: number | void) => {
      e.preventDefault();
      willDropIndex.value = -1;
      let optionItem = e.dataTransfer.getData("dragOptionItem"); // 按钮类型
      if (!optionItem) {
        return;
      }

      optionItem = JSON.parse(optionItem);
      if (optionItem.btnType == "value") {
        setAxisBoard(optionItem, dropIndex);
      } else { // 预约、循环等通用按钮
        setGeneralBtn(optionItem, dropIndex);
      }
    };

    const dragoverEvent = (e: Event) => {
      e.preventDefault();
    };

    const willDropIndex = ref(-1); // 将拖拽到的位置索引
    let draggingObj: DraggingObj = {};
    /**
     * 拖拽排序 滑过 board时触发（规律：往左移插入元素左侧，往右移插入元素右侧）
     * @param {Object} e 当前事件
     * @param {number} dropIndex 放下时box所在索引
     * @param {Object} item 放下时box所在的项
     */
    const dragoverBoardEvent = (e: Event, dropIndex: number) => {
      e.preventDefault();

      if (draggingObj.id) { // 已存在的box 拖拽
        willDropIndex.value = dropIndex;
        const dragIndex = draggingObj.index;
        if (dragIndex && dragIndex < dropIndex) { // 右移
          willDropIndex.value = dropIndex + 1;
        }

      } else { // 新增box时
        willDropIndex.value = dropIndex + 1;
      }
    }

    /**
     * @param {Object} e 当前事件
     * @param {number} index 当前数组索引
     * @param {Object} item 当前数组的项
     */
    const boardDragStart = (e: any, index: number, item: SettingsArrItem) => {
      draggingObj = {
        index,
        id: item.id,
        btnType: item.btnType,
        timestamp: item.timestamp
      };

      e.dataTransfer.setData("boardObj", JSON.stringify(draggingObj));
    };

    /**
     * 拖拽排序 放下时运行（规律：往左移插入元素左侧，往右移插入元素右侧）
     * @param {Object} e 当前事件
     * @param {number} dropIndex 放下时box所在索引
     * @param {Object} item 放下时box所在的项
     */
    const boardDrop = (e: Event, dropIndex: number, item: SettingsArrItem) => {
      e.preventDefault();
      rowDropEvent(e, dropIndex);
      
      if (!draggingObj.id || draggingObj.id === item.id) {
        return;
      }

      const boardList = settingsArr.value;
      // 判断循环box拖动是否合理
      if (draggingObj.btnType == 'loop') {
        const dragIndex = draggingObj.index;
        let sliceArr = boardList.slice(dropIndex, dragIndex);
        if (dragIndex && dragIndex < dropIndex) { // 右移
          sliceArr = boardList.slice(dragIndex + 1, dropIndex + 1);
        }

        for (const item of sliceArr) {
          if (item.btnType == 'loop') {
            return message.warning('不可拖动')
          }
        }
      }

      const dragSliceItem = boardList.splice(draggingObj.index!, 1)[0];
      boardList.splice(dropIndex, 0, dragSliceItem);

      setSerialNumber();
    };

    const boardDragEnd = () => {
      draggingObj = {};
      willDropIndex.value = -1;
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

    const deleteBoard = (index: number, btnType: string, timestamp: number | undefined) => {
      if (btnType == "loop") { // 循环
        settingsArr.value.splice(index, 1);

        const findIndex = settingsArr.value.findIndex((item: SettingsArrItem) => item.timestamp == timestamp);
        settingsArr.value.splice(findIndex, 1);

      } else {
        settingsArr.value.splice(index, 1);
      }

      setControlChange(settingsArr.value);
      setRowWidth();
    };

    // 子组件值变更后同步变更父组件的值
    /**
     * @param {Object} childObj 更改后的对象
     * @param {Object} item 原先的对象
     * @param {Object} parentItem 父对象，只有温度、湿度、光照会有
     */
    const changePanel = (childObj: SettingsArrItem, item: SettingsArrItem, parentItem: any) => {
      Object.assign(item, childObj);

      // 前后loop保持一致
      if (childObj.btnType == "loop" && childObj.isRightLoop) {
        const _setArr = settingsArr.value;
        const findIndex = _setArr.findIndex((obj: SettingsArrItem) => obj.timestamp == item.timestamp);
        _setArr[findIndex].loop = item.loop;

      } else if (parentItem) {
        // 同一列中温度、湿度、光照时长、功率同一
        for (const panelType of needPanelRowList.value) {
          parentItem.powerSize = childObj['powerSize'];
          parentItem[panelType]['powerSize'] = childObj['powerSize'];

          parentItem.duration = childObj['duration'];
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

      setSerialNumber();
    };

    // 设置box序号(显示在左上角)
    const setSerialNumber = () => {
      let _num: number = 1;
      for (const item of settingsArr.value) {
        if (item.btnType == 'value') {
          const serialNumber: string = _num < 10 ? '0' + _num : _num + '';
          for (const panelType of needPanelRowList.value) {
            item[panelType]['serialNumber'] = serialNumber;
          }

          _num++;
        }
      }
    }

    // 缩放
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
      if (changePageName.value == 'Editor') {
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
      scaleStyle,
      willDropIndex,
      rowDropEvent,
      boardDragStart,
      boardDrop,
      boardDragEnd,
      deleteDropEvent,
      dragoverEvent,
      dragoverBoardEvent,
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
  .drop-line {
    width: 0;
    border-right: solid 2px skyblue;
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
