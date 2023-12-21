<template>
  <div class="drag-sidebar">
    <div class="drag-group" v-for="(item, index) in list" :key="index">
      <div class="drag-group__title">
        {{ item.title }}
      </div>
      <div class="drag-group__content">
        <div class="drag-group-item" v-for="it in item.list" :key="it.key">
          <DragItem
            :data="it"
            :groupName="groupName"
            @click="onDragItemClick($event, it)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragItem from "./DragItem.vue";

import { DragSchema } from '@/views/drag/dragGrid/type/index';

withDefaults(
  defineProps<{
    list: DragSchema[];
    /** 拖拽分组标识 */
    groupName?: string;
  }>(),
  {
    groupName: "DrapDrop",
  }
);
</script>

<style scoped lang="less">
.drag-sidebar {
  overflow-y: auto;
  height: 100%;

  .drag-group {
    margin: 0 18px 24px;

    &__title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 700;
      color: #555555;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }
    &__content {
      display: flex;
      flex-wrap: wrap;
      gap: 16px 20px;
    }
  }
}
</style>
