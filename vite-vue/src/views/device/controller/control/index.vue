<template>
  <a-spin :spinning="detailLoading">
    <div class="scale-wrap">
      <div class="scale-box" :style="scaleStyle">
        <div class="control-box" :style="`width: ${rowWidth}`">
          <template v-for="(list, key) in panelObj" :key="key">
            <div class="control-row" @drop="rowDropEvent($event, key)" @dragover="dragoverEvent">
              <i :class="`iconfont ${key == 'temperature' ? 'icon-wendu' : 'icon-shidu'}`"></i>

              <transition-group tag="div" class="board-row">
                <template v-for="(item, index) in list" :key="item.id">
                  <template v-if="item.btnType != 'value'">
                    <!-- 预约 -->
                    <div
                      v-if="item.btnType == 'reservation'"
                      class="board reservation-board"
                      draggable="true"
                      @dragstart="boardDragStart($event, key, index, item)"
                      @drop="boardDrop(key, index, item)"
                      @dragend="boardDragEnd()"
                    >
                      <div class="cha-btn" @click="deleteBoard(key, index, item.btnType)">
                        <i class="iconfont icon-cha"></i>
                      </div>
                      <div class="clock-timer">
                        <div class="tag-box">
                          <span class="tag-span">CLOCK TIMER</span>
                        </div>
                        <a-date-picker
                          show-time
                          v-model:value="item.date"
                          format="YYYY-MM-DD HH:mm"
                          valueFormat="YYYY-MM-DD HH:mm"
                          @change="changeDate($event, key, index)"
                        />
                      </div>
                    </div>

                    <!-- 循环 -->
                    <template v-else-if="item.btnType == 'loop'">
                      <div
                        class="board loop-board"
                        draggable="true"
                        @dragstart="boardDragStart($event, key, index, item)"
                        @drop="boardDrop(key, index, item)"
                        @dragend="boardDragEnd()"
                      >
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
                              <a-input-number
                                v-else
                                class="loop-span"
                                :min="1"
                                :max="100"
                                :step="1"
                                :precision="0"
                                v-focus
                                v-model:value="item.loop"
                                @blur="showLoopInput(item, false, key)"
                              />
                            </template>
                          </div>
                        </div>
                      </div>

                      <!-- 循环内的 坐标轴板块 -->
                      <template v-if="item.loopChilds && item.loopChilds.length">
                        <template v-for="(loopItem, loopItemIndex) in item.loopChilds" :key="loopItem.id">
                          <div
                            class="board"
                            draggable="true"
                            @dragstart="boardDragStart($event, key, index, item, loopItem, loopItemIndex)"
                            @drop="boardDrop(key, index, item, loopItemIndex)"
                            @dragend="boardDragEnd()"
                          >
                            <div class="cha-btn" @click="deleteBoard(key, index, loopItem.btnType, loopItemIndex)">
                              <i class="iconfont icon-cha"></i>
                            </div>
                            <CoordinateAxis :axisObj="loopItem" @changeAxis="changeAxis($event, loopItem)" />
                          </div>
                        </template>
                      </template>
                    </template>
                  </template>

                  <!-- 坐标轴板块 -->
                  <div
                    v-else
                    class="board"
                    draggable="true"
                    @dragstart="boardDragStart($event, key, index, item)"
                    @drop="boardDrop(key, index, item)"
                    @dragend="boardDragEnd()"
                  >
                    <div class="cha-btn" @click="deleteBoard(key, index, item.btnType)">
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
  </a-spin>

  <div class="delete-btn" @drop="deleteDropEvent" @dragover="dragoverEvent">
    <i class="iconfont icon-shanchu"></i>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent, reactive, computed, onBeforeUnmount, inject, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { nanoid } from 'nanoid';
  import CoordinateAxis from './CoordinateAxis.vue';
  import { setControlChange, setPlanDetailChange } from '../useMitt';
  import { listenerScaleOption, removeScaleListener, listenerControlRefresh, listenerReplacePlan } from '../useMitt';
  import type { OptionsItem, PanelChildObj, DraggingObj } from '../types';
  import { planDetal } from '../controller.api';

  export default defineComponent({
    name: 'ControlRoom',
    components: {
      CoordinateAxis,
    },
    directives: {
      focus: {
        mounted: (el: any) => el.querySelector('input').focus(),
      },
    },
    setup() {
      const panelObj = reactive({
        temperature: [],
        humidity: [],
      });

      const detailLoading = ref(false);
      const injectDeviceObj = inject('changeDeviceObj', {});
      const getPlanDetal = (deviceId) => {
        Object.assign(panelObj, {
          temperature: [],
          humidity: [],
        });
        setControlChange(panelObj);

        if (!deviceId) {
          return;
        }

        detailLoading.value = true;
        const params = {
          deviceId,
        };
        planDetal(params)
          .then((res) => {
            detailLoading.value = false;
            if (res) {
              console.log('== 计划详情存在: ', res);
              if (res.settings) {
                Object.assign(panelObj, JSON.parse(res.settings));
                setControlChange(panelObj);
              }
              setPlanDetailChange(res);
            }
          })
          .catch(() => {
            detailLoading.value = false;
          });
      };

      watch(injectDeviceObj, (newVal) => {
        console.log('设备变更：', newVal);
        getPlanDetal(newVal?.id);
      });

      // 刷新详情
      listenerControlRefresh(() => {
        console.log(' === 单纯刷新');
        if (injectDeviceObj?.value && injectDeviceObj.value?.id) {
          getPlanDetal(injectDeviceObj.value?.id);
        }
      });

      // 用模板替换当前计划
      listenerReplacePlan((settings: string) => {
        if (!settings) {
          return;
        }

        const settingsObj = JSON.parse(settings);
        Object.assign(panelObj, settingsObj);
        console.log('=== settingsObj: ', settingsObj);

        setControlChange(panelObj);
      });

      // 放置通用按钮
      const setGeneralBtn = (optionItem: OptionsItem, panelType: string) => {
        function addReservationData() {
          panelObj[panelType].push({
            id: nanoid(),
            icon: optionItem.icon,
            date: undefined,
            btnType: optionItem.btnType,
          });
        }

        function addLoopData(bool: boolean, timestamp: number) {
          panelObj[panelType].push({
            id: nanoid(),
            icon: bool ? 'icon-jiantou16' : 'icon-jiantou10',
            loop: 1,
            isRightLoop: bool,
            btnType: optionItem.btnType,
            timestamp,
            loopChilds: [],
          });
        }

        if (optionItem.btnType == 'reservation') {
          // 预约 因为一个预约Box同时跨了温度、湿度两行，所以另一个数组也要加数据，但湿度行不显示该盒子
          addReservationData();
        } else if (optionItem.btnType == 'loop') {
          // 循环 插入左框、右框
          const timestamp = new Date().getTime();
          addLoopData(false, timestamp);
          addLoopData(true, timestamp);
        }

        setControlChange(panelObj);
        setRowWidth();
      };

      // 放置坐标版
      const setAxisBoard = (optionItem: OptionsItem, panelType: string) => {
        let startValue = 10;
        let endValue = 20;
        if (optionItem.valueType == 'constant') {
          endValue = 10;
        }

        let newIndex = panelObj[panelType].length + 1;
        newIndex = newIndex < 10 ? '0' + newIndex : newIndex;

        panelObj[panelType].push({
          id: nanoid(),
          icon: optionItem.icon,
          duration: 70,
          startValue,
          endValue,
          valueType: optionItem.valueType,
          index: newIndex,
          btnType: 'value',
        });

        setControlChange(panelObj);
        setRowWidth();
      };

      // 拖拽释放事件 panelType: 所在面板类型
      const rowDropEvent = (e: any, panelType: string) => {
        e.preventDefault();
        let optionItem = e.dataTransfer.getData('optionItem'); // 按钮类型
        if (!optionItem) {
          return;
        }

        optionItem = JSON.parse(optionItem);
        if (panelType != optionItem.panelType && optionItem.btnType == 'value') {
          return message.warning('请选择对应类型按钮');
        }

        if (optionItem.btnType != 'value') {
          // 预约、循环等通用按钮
          setGeneralBtn(optionItem, panelType);
        } else {
          setAxisBoard(optionItem, panelType);
        }
      };

      const dragoverEvent = (e: Event) => {
        e.preventDefault();
      };

      let draggingObj: DraggingObj = {};
      /**
       * @param {string} panelType temperature-温度行数组 humidity-湿度行数组
       * @param {number} index 当前数组索引
       * @param {Object} item 当前数组的项
       * @param {Object} loopItem 当前数组项下loopChilds数组里的值
       * @param {number} loopChildIndex 当前数组项下loopChilds数组里的索引
       */
      const boardDragStart = (
        e: any,
        panelType: string,
        index: number,
        item: PanelChildObj,
        loopItem: PanelChildObj,
        loopItemIndex: number
      ) => {
        draggingObj = { panelType, index, btnType: item.btnType, id: item.id, timestamp: item.timestamp };

        if (loopItemIndex || loopItemIndex === 0) {
          // 存在则说明当前项在循环box内
          draggingObj.id = loopItem.id;
          draggingObj.loopItemIndex = loopItemIndex;
        }
        e.dataTransfer.setData('boardObj', JSON.stringify(draggingObj));
      };

      // 拖拽排序 放下时运行
      const boardDrop = (panelType: string, index: number, item: PanelChildObj, loopItemIndex: number) => {
        if (!draggingObj.id || draggingObj.id === item.id) {
          return;
        }

        const boardList = panelObj[panelType];
        if (!loopItemIndex && !draggingObj.loopItemIndex && loopItemIndex !== 0 && draggingObj.loopItemIndex !== 0) {
          // 交互排序的两盒子都不在循环box内
          if (item.btnType != 'loop' && draggingObj.btnType != 'loop') {
            // 未与循环box做交互
            const dragSliceItem = boardList.splice(draggingObj.index, 1)[0];
            boardList.splice(index, 0, dragSliceItem);
          } else if (item.btnType != 'loop' && draggingObj.btnType == 'loop') {
            // 拖拽盒子是循环box
            const dragSliceItem = boardList.splice(index, 1)[0];
            const findIndex = boardList.findIndex((obj: PanelChildObj) => draggingObj.timestamp == obj.timestamp);
            boardList[findIndex].loopChilds.push(dragSliceItem);
          } else if (item.btnType == 'loop' && draggingObj.btnType != 'loop') {
            // 拖拽盒子 不是循环box
            if (draggingObj.btnType == 'loop' || draggingObj.btnType == 'reservation') {
              message.warning('不可拖动');
            } else {
              const dragSliceItem = boardList.splice(draggingObj.index, 1)[0];
              const findIndex = boardList.findIndex((obj: PanelChildObj) => item.timestamp == obj.timestamp);
              boardList[findIndex].loopChilds.push(dragSliceItem);
            }
          } else {
            // 两个都是循环box
            message.warning('不可拖动');
          }
        } else if ((loopItemIndex || loopItemIndex === 0) && !draggingObj.loopItemIndex && draggingObj.loopItemIndex !== 0) {
          // 放置位置的盒子在循环box内
          if (draggingObj.btnType == 'loop' || draggingObj.btnType == 'reservation') {
            message.warning('不可拖动');
          } else {
            const dragSliceItem = boardList.splice(draggingObj.index, 1)[0];
            const findIndex = boardList.findIndex((obj: PanelChildObj) => item.timestamp == obj.timestamp);
            boardList[findIndex].loopChilds.push(dragSliceItem);
          }
        } else if (!loopItemIndex && loopItemIndex !== 0 && (draggingObj.loopItemIndex || draggingObj.loopItemIndex === 0)) {
          // 拖拽盒子在循环box内
          const dragSliceItem = boardList[draggingObj.index]['loopChilds'].splice(draggingObj.loopItemIndex, 1)[0];
          const spliceIndex = item.isRightLoop ? index + 1 : index;
          boardList.splice(spliceIndex, 0, dragSliceItem);
        } else {
          // 两盒子都在循环box里
          if (item.timestamp != draggingObj.timestamp) {
            // 在不同循环box里
            const dragSliceItem = boardList[draggingObj.index]['loopChilds'].splice(draggingObj.loopItemIndex, 1)[0];
            const findIndex = boardList.findIndex((obj: PanelChildObj) => item.timestamp == obj.timestamp);
            boardList[findIndex]['loopChilds'].splice(loopItemIndex, 0, dragSliceItem);
          } else {
            const dragSliceItem = boardList[draggingObj.index]['loopChilds'].splice(draggingObj.loopItemIndex, 1)[0];
            boardList[draggingObj.index]['loopChilds'].splice(loopItemIndex, 0, dragSliceItem);
          }
        }

        setControlChange(panelObj);
      };

      const boardDragEnd = () => {
        draggingObj = {};
      };

      // board 拖拽到删除icon 处时触发删除事件
      const deleteDropEvent = (e: any) => {
        e.preventDefault();
        let boardObj = e.dataTransfer.getData('boardObj'); // 按钮类型
        if (!boardObj) {
          return;
        }

        boardObj = JSON.parse(boardObj);
        deleteBoard(boardObj.panelType, boardObj.index, boardObj.btnType, boardObj.loopItemIndex);
      };

      const deleteBoard = (panelType: string, index: number, btnType: string, loopItemIndex: number | undefined) => {
        console.log('=== index, btnType, loopItemIndex', index, btnType, loopItemIndex);

        if (loopItemIndex) {
          // 坐标板块在循环box内
          panelObj[panelType][index]['loopChilds'].splice(loopItemIndex, 1);
        } else if (btnType == 'value') {
          panelObj[panelType].splice(index, 1);
          setControlChange(panelObj);
          setRowWidth();
        } else if (btnType == 'reservation') {
          // 预约
          panelObj[panelType].splice(index, 1);
        } else if (btnType == 'loop') {
          // 循环
          const loopItem = panelObj[panelType][index];
          const timestamp = loopItem.timestamp;
          const loopChilds = loopItem.loopChilds;
          panelObj[panelType].splice(index, 1);

          const findIndex = panelObj[panelType].findIndex((item: PanelChildObj) => item.timestamp == timestamp);
          panelObj[panelType].splice(findIndex, 1);
          panelObj[panelType].splice(index, 0, ...loopChilds);
        }
      };

      // 子组件值变更后同步变更父组件的值
      const changeAxis = (childObj: PanelChildObj, item: PanelChildObj) => {
        Object.assign(item, childObj);
        setControlChange(panelObj);
      };

      // 更改预约值，同步修改湿度预约值
      const changeDate = (date: string | null, panelType: string, index: number) => {
        panelObj[panelType][index]['date'] = date;
        setControlChange(panelObj);
      };

      const rowWidth = ref('500px');
      const setRowWidth = () => {
        let maxLen = panelObj['temperature'].length;
        if (maxLen < panelObj['humidity'].length) {
          maxLen = panelObj['humidity'].length;
        }

        rowWidth.value = 80 + maxLen * 250 + 300 + 'px';
      };

      const scaleObj = reactive({
        width: 100,
        height: 100,
        scale: 1,
      });
      const scaleStyle = computed(() => {
        return {
          width: `${scaleObj.width}%`,
          height: `${scaleObj.height}%`,
          transform: `scale(${scaleObj.scale})`,
        };
      });

      listenerScaleOption((type: string) => {
        if (type == 'amplify') {
          // 放大
          scaleObj.width *= 0.8;
          scaleObj.height *= 0.8;
          scaleObj.scale *= 1.25;
        } else if (type == 'reduce') {
          // 缩小
          scaleObj.width = scaleObj.width >= 100 ? 100 : scaleObj.width * 1.25;
          scaleObj.height = scaleObj.height >= 100 ? 100 : scaleObj.height * 1.25;
          scaleObj.scale *= 0.8;
        } else if (type == 'restore') {
          // 还原
          scaleObj.width = 100;
          scaleObj.height = 100;
          scaleObj.scale = 1;
        }
      });

      // 是否显示循环次数输入框
      const showLoopInput = (item: PanelChildObj, bool: boolean, panelType: string) => {
        item.isshowLoopInput = bool;
        if (!bool) {
          // 前后loop保持一致
          const findIndex = panelObj[panelType].findIndex((obj: PanelChildObj) => obj.timestamp == item.timestamp);
          panelObj[panelType][findIndex].loop = item.loop;
        }
        setControlChange(panelObj);
      };

      onBeforeUnmount(() => {
        removeScaleListener();
      });

      return {
        rowWidth,
        panelObj,
        scaleStyle,
        detailLoading,
        rowDropEvent,
        boardDragStart,
        boardDrop,
        boardDragEnd,
        deleteDropEvent,
        dragoverEvent,
        deleteBoard,
        changeAxis,
        changeDate,
        showLoopInput,
      };
    },
  });
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
        transform: scale(0.6);
        -moz-transform: scale(0.6);
        -webkit-transform: scale(0.6);
        -o-transform: scale(0.6);
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
