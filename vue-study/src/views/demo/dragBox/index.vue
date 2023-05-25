<template>
  <transition-group tag="div" class="container">
    <div
      class="item"
      v-for="(item, index) in itemList"
      :key="item.key"
      :style="{ background: item.color, width: '80px', height: '80px' }"
      draggable="true"
      @dragstart="handleDragStart($event, item)"
      @dragover.prevent="handleDragOver($event, item)"
      @dragenter="handleDragEnter($event, item)"
      @dragend="handleDragEnd($event, item)"
    ></div>
  </transition-group>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DemoDragBox',
  setup() {
    const itemList = ref([
      { key: 1, color: "#ffebcc" },
      { key: 2, color: "#ffb86c" },
      { key: 3, color: "#f01b2d" },
    ])
    const draggingItem = ref(null);

    const handleDragStart = (e, item) => {
      draggingItem.value = item;
    }

    const handleDragEnd = (e, item) => {
      draggingItem.value = null;
    }

    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    const handleDragOver = (e) => {
      // e.dataTransfer.dropEffect = "move"; // 在dragenter中针对放置目标来设置!
    }

    const handleDragEnter = (e, item) => {
      // e.dataTransfer.effectAllowed = "move"; // 为需要移动的元素设置dragstart事件
      if (item.key === draggingItem.value?.key) {
        return;
      }
      const newItems = [...itemList.value];
      const src = newItems.indexOf(draggingItem.value);
      const dst = newItems.indexOf(item);

      newItems.splice(dst, 0, ...newItems.splice(src, 1));

      itemList.value = newItems;
    }

    return {
      itemList,
      draggingItem,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragEnter,
    }
  },
})
</script>

<style scoped>
.container {
  display: flex;
}
.item {
  margin: 50px;
  transition: all linear 0.3s;
}
</style>
