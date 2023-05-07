<template>
  <div class="top-bar">
    <div class="bar-left">
      <div class="save-btn" @click="saveAxis">
        <i class="iconfont icon-save"></i>
      </div>
      <OptionsBtn v-show="pageName == 'Editor'" />
    </div>

    <div class="nav-box">
      <template v-for="name in pageNameList" :key="name">
        <span :class="{'active': pageName == name }" @click="setPageName(name)">{{ name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import OptionsBtn from './OptionsBtn.vue';

export default defineComponent({
  name: 'TopBar',
  components: {
    OptionsBtn
  },
  props: {
    pageName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  emits: ['changePageName'],
  setup(_, { emit }) {
    const pageNameList = ref(['Editor', 'Simulation']);

    const setPageName = name => {
      emit('changePageName', name)
    }

    const saveAxis = () => {
      message.success('点击保存')
    }

    return {
      pageNameList,
      setPageName,
      saveAxis
    }
  },
})
</script>

<style lang="less" scoped>
.top-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  width: 100%;
  padding: 0 15px;
  height: 0;
  box-sizing: border-box;
}
.top-bar::before {
  z-index: 2;
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 20px;
  background: linear-gradient(180deg, #aaa, #555);
}

.bar-left {
  display: flex;
}
.save-btn {
  position: relative;
  z-index: 2;
  width: 40px;
  height: 40px;
  margin: 3px 20px 0 3px;
  line-height: 40px;
  text-align: center;
  background: #333;
  border-top: solid 2px #aaa;
  border-left: solid 2px #aaa;
  border-bottom: solid 1px #555;
  border-right: solid 1px #555;
  box-shadow: -2px -2px 3px 1px #333;
  cursor: pointer;

  .iconfont {
    font-size: 28px;
  }
}

.nav-box {
  z-index: 2;
  height: 20px;
  line-height: 20px;
  span {
    padding: 0 7px;
    background: #aaa;
    border-right: solid 1px #aaa;
    cursor: pointer;
  }
  .active {
    background: #333;
  }
}
</style>
