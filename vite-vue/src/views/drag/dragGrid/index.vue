<template>
  <div class="drag-container">
    <div class="drag-container__left">
      <LeftSidebar :list="demoList" group-name="drag-demo" />
    </div>
    <div class="drag-container__right">
      <div class="mb16" style="width: 100%; height: 100%">
        <DropContent
          v-model="data"
          ref="dropContentRef"
          group-name="drag-demo"
          :row="6"
          :column="6"
          :gap="6"
        >
          <template #preview-item="{ data }">
            <div
              style="height: 100%; background: #f9f1c7; border-radius: 6px"
            ></div>
          </template>
          <template #move-mask="{ isPutDown }">
            <div
              :style="{
                width: '100%',
                height: '100%',
                border: '2px solid #2867f979',
                backgroundColor: isPutDown ? '#2867f91c' : '#ff000055',
                borderColor: isPutDown ? '#2c68f3' : '#ff000079',
                'border-radius': '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: '600',
              }"
            >
              {{ isPutDown ? "可以放置" : "不可放置" }}
            </div>
          </template>
        </DropContent>
      </div>
      <div class="mb16">
        <a-button class="bottom-btn" @click="() => dropContentRef.addRow()">添加行</a-button>
        <a-button class="bottom-btn" @click="() => dropContentRef.deleteRow()">删除行</a-button>
        <a-button class="bottom-btn" @click="consoleDataLog">打印结果集</a-button>
      </div>
      <!-- <h3 class="mb16">预览</h3>
      <div style="width: 100%; height: 100%">
        <PreviewLayout
          :data="data"
          :row="6"
          :column="6"
          :gap="6"
          :skipEmpty="false"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 参考：https://juejin.cn/post/7313048145529487369?searchId=20231221093053E994AE5B941D0CC6FEDF

import { ref } from "vue";
import LeftSidebar from "./components/LeftSidebar.vue";
import DropContent from "./components/DropContent.vue";
import PreviewLayout from "./components/PreviewLayout.vue";
import demoList from "./schema";
import { log } from "console";

const data = ref([
  {
    id: 1111,
    key: "demo-component",
    title: "组件标题",
    column: 1,
    row: 1,
    x: 1,
    y: 1,
  },
  {
    id: 2222,
    key: "demo-component",
    title: "组件标题",
    column: 1,
    row: 1,
    x: 2,
    y: 3,
  },
]);

const dropContentRef = ref<InstanceType<typeof DropContent>>();

const consoleDataLog = () => {
  console.log("== 布局data: ", data);
}
</script>

<style scoped lang="less">
.drag-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-shrink: 0;

  &__left {
    width: 260px;
  }

  &__right {
    flex: 1;
    width: 0;
    background: #032bfb1a;
    border-radius: 6px;
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }
}

.mb16 {
  margin-bottom: 16px;
}
.bottom-btn {
  margin-right: 10px;
}
</style>
