<template>
  <div class="option-box">
    <div class="option-item" v-for="item in optionList" :key="item.type">
      <img class="img-little" :src="item.url" />
      <div :class="{ 'line': true, 'rotate': item.isRotate }"></div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'OptionsName',
  setup() {
    const optionList = ref([
      {
        url: 'https://img0.baidu.com/it/u=3807993216,142160708&amp;fm=253&amp;fmt=auto&amp;app=120&amp;f=JPEG?w=800&amp;h=851',
        isRotate: true,
        type: 'temperature-range'
      },
      {
        url: 'https://img0.baidu.com/it/u=3807993216,142160708&amp;fm=253&amp;fmt=auto&amp;app=120&amp;f=JPEG?w=800&amp;h=851',
        isRotate: false,
        type: 'temperature-constant'
      }
    ])
    
    return {
      optionList
    }
  },
})
</script>

<style lang="less" scoped>
.option-box {
  display: flex;
}
.option-item {
  display: flex;
  justify-content: space-between;
  width: 50px;
  height: 40px;
  padding: 5px;
  background: #333;
  border: solid 1px #eee;
  
  .img-little {
    width: 15px;
    height: 30px;
  }
  .line {
    width: 20px;
    height: 0;
    margin-top: 10px;
    border-top: solid 2px yellow;
  }
  .rotate {
    width: 25px;
    margin-top: 14px;
    margin-left: 3px;
    transform: rotate(-45deg);
  }
}
</style>
