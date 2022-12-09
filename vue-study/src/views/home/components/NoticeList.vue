<template>
  <div class="notice-wrap">
    <a-row class="notice-head" align="middle" justify="space-between">
      <span class="notice-title">{{ title }}</span>
      <span class="more">more ></span>
    </a-row>

    <div class="list-wrap">
      <template v-for="item in 10" :key="item">
        <a-row align="middle" justify="space-between">
          <span class="text">赛意信息12月08日被深股通减持3.41万股</span>
          <span class="date">12-08</span>
        </a-row>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoticeList',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  setup() {
    
    return {

    }
  },
})
</script>

<style lang="less" scoped>
.notice-wrap {
  width: 100%;
  padding: 20px;
  margin-bottom: 15px;
  border: solid 1px #ddd;
  box-sizing: border-box;
}
.notice-head {
  margin-bottom: 20px;
}
.notice-title {
  font-size: 14px;
  font-weight: bold;
  /* line-height: 20px; */
}
.more {
  color: #aaa;
  cursor: pointer;
}

.list-wrap {
  height: 320px;
  overflow-y: auto;
  .ant-row {
    margin: 0 0 10px;
  }
  .text {
    flex: 1;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .date {
    width: 60px;
    text-align: right;
  }
}
.list-wrap::-webkit-scrollbar {
  display: none;
}
</style>
