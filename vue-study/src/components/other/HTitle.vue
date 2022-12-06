<template>
  <div class="title-wrap">
    <div :class="`title-level-${level}`">
      <slot />
    </div>
    <div class="title-dec">
      <slot name="dec" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HTitle',
  props: {
    level: {
      type: [Number, String],
      default: () => {
        return '1'
      }
    }
  },
  setup() {

    return {
      
    }
  },
})
</script>

<style scoped>
.title-wrap {
  margin: 15px 0;
}
.title-level-1 {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.title-level-1::before {
  content: '';
  display: inline-block;
  width: 0;
  height: 1em;
  margin-right: 10px;
  border-left: solid 4px #196ffa;
}
.title-dec {
  font-size: 14px;
  color: #aaa;
}
</style>
