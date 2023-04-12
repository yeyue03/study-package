<template>
    <div class="control-row">
      <img class="img" src="https://img0.baidu.com/it/u=3807993216,142160708&amp;fm=253&amp;fmt=auto&amp;app=120&amp;f=JPEG?w=800&amp;h=851" />
      <div class="board">
        <CoordinateAxis />
      </div>

      <div class="bg-row">
        <div class="gray-block"></div>
      </div>
    </div>

    <div class="control-row">
      <img class="img" src="https://img0.baidu.com/it/u=3807993216,142160708&amp;fm=253&amp;fmt=auto&amp;app=120&amp;f=JPEG?w=800&amp;h=851" />
      <div class="board">
        <CoordinateAxis />
      </div>

      <div class="bg-row">
        <div class="gray-block"></div>
      </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import CoordinateAxis from './CoordinateAxis.vue';

export default defineComponent({
  name: 'ControlRoom',
  components: {
    CoordinateAxis
  },
  setup() {
    
    return {

    }
  },
})
</script>

<style lang="less" scoped>
.control-row {
  position: relative;
  display: flex;
  align-items: center;
  margin: 5px 0;

  .img {
    z-index: 2;
    width: 40px;
    height: 40px;
    margin-right: 40px;
    border: solid 1px #eee;
  }

  .board {
    z-index: 2;
    border: solid 2px #eee;
    border-radius: 3px;
    padding: 3px;
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
  height: 210px;

  .gray-block {
    width: 100%;
    height: 40px;
    background: #ddd;
  }
}
</style>
