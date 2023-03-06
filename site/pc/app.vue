<script>
import {useRoute} from "vue-router";
import Demo from "./src/demo.md";
export default {
  name: "app",
  components: {
    Demo,
  },
};
</script>

<template>
  <div>
    1232
    <Demo></Demo>
    <router-view></router-view>
  </div>
</template>
