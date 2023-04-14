<template>
  <div class="item-wrap">
    <div class="item-box">
      <span>HPP 260</span>
      <a-row class="img-box" type="flex" align="bottom" justify="space-between">
        <a-row>
          <img class="img-left" src="https://img0.baidu.com/it/u=2826200390,835824988&amp;fm=253&amp;app=120&amp;size=w931&amp;n=0&amp;f=JPEG&amp;fmt=auto?sec=1681232400&amp;t=ec1d56123fc60998f62a20b3aa0b3543" />

          <div class="icon-box">
            <i class="iconfont icon-wendu"></i>
            <i class="iconfont icon-shidu"></i>
          </div>
        </a-row>

        <i class="iconfont icon-xinxiinfo21 icon-help" @click="showInfoPopup"></i>
      </a-row>

      <div v-show="visibleInfo" class="info-popup">
        <InfoPopup @hideInfoPopup="hideInfoPopup" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import InfoPopup from './InfoPopup.vue';

export default defineComponent({
  name: "ChartSideBar",
  components: {
    InfoPopup
  },
  setup() {
    const visibleInfo = ref(false);
    const showInfoPopup = () => {
      visibleInfo.value = !visibleInfo.value;
    }

    const hideInfoPopup = () => {
      visibleInfo.value = false;
    }

    return {
      visibleInfo,
      showInfoPopup,
      hideInfoPopup
    };
  },
});
</script>

<style lang="less" scoped>
.item-wrap {
  width: 100%;
  height: 130px;
  padding: 5px;
  box-sizing: border-box;
  background: #333;
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
  box-sizing: border-box;
  border: solid 3px yellow;
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

.info-popup {
  z-index: 5;
  position: absolute;
  top: -5px;
  left: 190px;
}
</style>
