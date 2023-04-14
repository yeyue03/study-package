<template>
  <div class="info-wrap">
    <div class="title">Info</div>
    <div class="info-box">
      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Device Type</a-col>
        <a-col :span="rightSpan">HTTP 260</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">User Defined Name</a-col>
        <a-col :span="rightSpan">
          <a-input></a-input>
        </a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Serial No</a-col>
        <a-col :span="rightSpan">W6130053</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Server Address</a-col>
      </a-row>

      <hr />

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Temperature Range</a-col>
        <a-col :span="rightSpan">0-70C</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Humidity Range</a-col>
        <a-col :span="rightSpan">10-90 %rH</a-col>
      </a-row>

      <hr />

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">License</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">License type</a-col>
        <a-col :span="rightSpan">permanent license</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Remaining period</a-col>
        <a-col :span="rightSpan">unlimited</a-col>
      </a-row>

      <a-row type="flex" align="middle">
        <a-col :span="leftSpan">Customer</a-col>
      </a-row>

      <a-row justify="center">
        <a-button size="small" @click="hideInfoPopup">Close</a-button>
      </a-row>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoPopup',
  emits: ['hideInfoPopup'],
  setup(_, { emit }) {
    
    const hideInfoPopup = () => {
      emit('hideInfoPopup');
    }

    return {
      leftSpan: 8,
      rightSpan: 16,
      hideInfoPopup,
    }
  },
})
</script>

<style lang="less" scoped>
.info-wrap {
  width: 500px;
  border: solid 3px #eee;
  background: #333;
  border-radius: 5px;

  .title {
    font-size: 25px;
    padding: 0 10px;
    background: linear-gradient(0deg, #666 30%, #333 70%);
  }

  .info-box {
    padding: 10px;
    font-size: 15px;
  }
}

</style>
