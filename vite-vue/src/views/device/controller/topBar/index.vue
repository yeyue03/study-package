<template>
  <div class="top-bar">
    <div class="bar-left">
      <UpOptionsBtn v-show="pageName == 'Editor'" />
      <DownOptionsBtn v-show="pageName == 'Editor'" />
    </div>

    <div class="nav-box">
      <template v-for="name in pageNameList" :key="name">
        <span :class="{ active: pageName == name }" @click="setPageName(name)">{{ name }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import UpOptionsBtn from './UpOptionsBtn.vue';
  import DownOptionsBtn from './DownOptionsBtn.vue';

  export default defineComponent({
    name: 'TopBar',
    components: {
      UpOptionsBtn,
      DownOptionsBtn,
    },
    props: {
      pageName: {
        type: String,
        default: () => {
          return '';
        },
      },
    },
    emits: ['changePageName'],
    setup(_, { emit }) {
      const pageNameList = ref(['Protocol', 'Editor', 'Simulation']);

      const setPageName = (name: string) => {
        emit('changePageName', name);
      };

      return {
        pageNameList,
        setPageName,
      };
    },
  });
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
