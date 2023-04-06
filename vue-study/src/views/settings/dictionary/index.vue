<template>
  <div class="container">
    <a-row justify="space-between">
      <DictionaryType />
    </a-row> 
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import DictionaryType from './components/DictionaryType.vue';

export default defineComponent({
  name: 'Dictionary',
  components: {
    DictionaryType
  },
  setup() {
    
  },
})
</script>
