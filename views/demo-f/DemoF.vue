<template>
  <div class="demo-f"></div>
</template>

<script lang="ts">
  import {props} from "./props";
  import {defineComponent} from "vue";
  export default defineComponent({
    name: "demo-f",
    props,
    setup() {},
  });
</script>

<style lang="scss">
  @import "./demoF.scss";
</style>
