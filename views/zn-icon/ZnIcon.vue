<template>
  <svg aria-hidden="true" :style="getStyle" class="zn-icon">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script lang="ts" setup>
import {props} from "./props";
import {computed, CSSProperties} from "vue";

let prop = defineProps(props);
const symbolId = computed(() => `#${prop.prefix}-${prop.name}`);
const getStyle = computed((): CSSProperties => {
  const {size} = prop;
  let s = `${size}`;
  s = `${s.replace("px", "")}px`;
  return {
    width: s,
    height: s,
  };
});
</script>

<style lang="scss">
@import "./znIcon.scss";
</style>
