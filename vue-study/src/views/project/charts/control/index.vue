<template>
  <div class="control-wrap">
    <div class="top-btn">
      <OptionBtn />
    </div>

    <div class="control-box">
      <template v-for="(list, key) in controlObj" :key="key">
        <div class="control-row" @drop="dropEvent($event, key)" @dragover="dragoverEvent">
          <i :class="`iconfont ${key == 'temperature' ? 'icon-wendu' : 'icon-shidu'}`"></i>

          <div class="board" v-for="item in list" :key="item.id">
            <CoordinateAxis :axisObj="item" />
          </div>

          <div class="bg-row">
            <div class="gray-block"></div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import OptionBtn from './OptionsBtn.vue';
import CoordinateAxis from './CoordinateAxis.vue';

export default defineComponent({
  name: 'ControlRoom',
  components: {
    OptionBtn,
    CoordinateAxis
  },
  setup() {
    const controlObj = reactive({
      temperature: [
        {
          icon: 'icon-wendu',
          startValue: 20,
          endValue: 10,
          optionType: 'temperature-range',
        }
      ],
      humidity: [{
        icon: 'icon-shidu',
        startValue: 20,
        endValue: 10,
        optionType: 'humidity-range'
      }],
    })
    
    // 拖拽释放事件 controlType: 所在面板类型
    const dropEvent = (e, controlType) => {
      e.preventDefault();
      const optionType = e.dataTransfer.getData("optionType"); // 按钮类型
      if (!optionType) {
        return
      }

      let startValue = 10;
      let endValue = 20;
      if (optionType == 'temperature-constant' || optionType == 'humidity-constant') {
        endValue = 10;
      }

      controlObj[controlType].push({
        id: Math.random(),
        startValue,
        endValue,
        optionType,
        icon: controlType == 'temperature' ? 'icon-wendu' : 'icon-shidu'
      })
      console.log("=== optionType", optionType);
    }

    const dragoverEvent = e => {
      e.preventDefault();
    }
    
    return {
      controlObj,
      dropEvent,
      dragoverEvent
    }
  },
})
</script>

<style lang="less" scoped>
.control-wrap {
  position: relative;
  height: 100%;
  background: #333;
}
.top-btn {
  z-index: 2;
  width: 100%;
  height: 40px;
}

.control-box {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
  width: 100%;
  padding: 90px 0 50px;
}
.control-row {
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0;

  .iconfont {
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
}
.bg-row {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 208px;

  .gray-block {
    width: 100%;
    height: 40px;
    background: #ccc;
  }
}
</style>
