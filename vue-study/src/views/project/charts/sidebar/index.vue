<template>
  <div class="item-wrap">
    <div class="item-box">
      <span>HPP 260</span>
      <a-row class="img-box" type="flex" align="bottom" justify="space-between">
        <a-row>
          <img class="img-left" src="https://img0.baidu.com/it/u=2826200390,835824988&amp;fm=253&amp;app=120&amp;size=w931&amp;n=0&amp;f=JPEG&amp;fmt=auto?sec=1681232400&amp;t=ec1d56123fc60998f62a20b3aa0b3543" />

          <div>
            <img class="img-little" src="https://img0.baidu.com/it/u=3807993216,142160708&amp;fm=253&amp;fmt=auto&amp;app=120&amp;f=JPEG?w=800&amp;h=851" />
            <br />
            <img class="img-little" src="https://img0.baidu.com/it/u=2439550938,2482018825&fm=253&fmt=auto&app=138&f=JPG?w=500&h=500" />
          </div>
        </a-row>

        <img class="img-little" src="https://img2.baidu.com/it/u=2846650635,2580703468&amp;fm=253&amp;app=138&amp;size=w931&amp;n=0&amp;f=JPEG&amp;fmt=auto?sec=1681232400&amp;t=d366aad5250c1762b388ccd811f87bcb" @click="showInfoPopup" />
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
      visibleInfo.value = true;
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
    width: 60px;
    height: auto;
    margin-right: 5px;
  }

  .img-little {
    width: 30px;
    height: 30px;
  }
}

.info-popup {
  z-index: 5;
  position: absolute;
  top: -5px;
  left: 190px;
}
</style>
