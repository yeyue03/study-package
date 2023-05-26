<template>
  <div class="scheme-box">
    <template v-for="(item, index) in schemeList" :key="item.id">
      <div class="item-border" @click="clickScheme(item)">
        <div :class="{'item-box': true, 'active-box': item.id == activeSchemeObj.id}">
          <span>{{ item.name }}</span>
          <a-row class="img-box" type="flex" align="bottom" justify="space-between">
            <a-row>
              <img class="img-left" src="https://img0.baidu.com/it/u=2826200390,835824988&amp;fm=253&amp;app=120&amp;size=w931&amp;n=0&amp;f=JPEG&amp;fmt=auto?sec=1681232400&amp;t=ec1d56123fc60998f62a20b3aa0b3543" />

              <div class="icon-box">
                <i class="iconfont icon-wendu"></i>
                <i class="iconfont icon-shidu"></i>
              </div>
            </a-row>

            <i class="iconfont icon-xinxiinfo21 icon-help" @click.stop="showInfoPopup(item, index)"></i>
          </a-row>
        </div>
      </div>
    </template>
  </div>

  <div v-show="visibleInfo" class="info-popup" :style="`top: ${infoPopTop}px`">
    <InfoPopup @hideInfoPopup="hideInfoPopup" />
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import InfoPopup from './InfoPopup.vue';

export default defineComponent({
  name: "ChartSideBar",
  components: {
    InfoPopup
  },
  emits: ['selectScheme'],
  setup(_, { emit }) {
    const visibleInfo = ref(false);
    const activeSchemeObj = reactive({}); 
    const schemeList = ref([
      { id: 1, name: 'HPP 260' },
      { id: 2, name: 'HPP 260' },
      { id: 3, name: 'HPP 263' },
      { id: 4, name: 'HPP 260' },
      { id: 5, name: 'HPP 260' },
      { id: 6, name: 'HPP 260' },
      { id: 7, name: 'HPP 260' },
      { id: 8, name: 'HPP 260' },
      { id: 9, name: 'HPP 260' },
      { id: 10, name: 'HPP 260' },
      { id: 11, name: 'HPP 260' },
      { id: 12, name: 'HPP 260' },
    ]);
    const infoPopTop = ref(0);

    const clickScheme = (item) => {
      Object.assign(activeSchemeObj, item);
      emit('selectScheme', item);
    }

    const showInfoPopup = (item, index: number) => {
      console.log("== item: ", item);
      console.log("== index: ", index);
      // infoPopTop.value = 130 * index;
      visibleInfo.value = true;
    }

    const hideInfoPopup = () => {
      visibleInfo.value = false;
    }

    return {
      visibleInfo,
      infoPopTop,
      schemeList,
      activeSchemeObj,
      clickScheme,
      showInfoPopup,
      hideInfoPopup
    };
  },
});
</script>

<style lang="less" scoped>
.scheme-box {
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
.scheme-box::-webkit-scrollbar {
  display: none;
}
.item-border {
  // width: 100%;
  width: 200px;
  height: 130px;
  padding: 5px;
  box-sizing: border-box;
  background: @sider-dark-bg-color;
  border: solid 1px #ccc;
}
.item-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 5px;
  border: solid 3px transparent;
  box-sizing: border-box;
  border-radius: 5px;

  .img-left {
    width: 55px;
    height: auto;
    margin-right: 5px;
  }

  .icon-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
  }
  .icon-wendu {
    font-size: 20px;
  }
  .icon-help {
    width: 25px;
    height: 25px;
    font-size: 16px;
    text-align: center;
    color: #333;
    background: #eee;
    cursor: pointer;
  }
}
.active-box {
  border: solid 3px yellow;
}

.info-popup {
  position: absolute;
  top: -5px;
  // left: 190px;
  right: -500px;
}
</style>
