<template>
  <div class="container">
    <coordinate-axis></coordinate-axis>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import CoordinateAxis from "./components/CoordinateAxis.vue";

export default defineComponent({
  name: "DemoCanvas",
  components: {
    CoordinateAxis,
  },
  setup() {
    return {};
  },
});
</script>
