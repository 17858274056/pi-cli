<template>
  <div class="keylion-codeExample">
    <div class="util">
      <i
        class="bg"
        @click="clip"
        :id="`clip-trigger-${cid}`"
        :data-clipboard-target="`#clip-target-${cid}`"
      ></i>
    </div>
    <div :id="`clip-target-${cid}`">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "code-example",
};
</script>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import Clipboard from "clipboard";
import {autoClip} from "./utils";

let cid = ref(autoClip());

onMounted(clip);

function clip() {
  const trigger = new Clipboard(`#clip-trigger-${cid.value}`);

  trigger.on("success", (e) => {});
}
</script>

<style lang="scss" scoped>
.keylion-codeExample {
  background-color: var(--keylion-hljs-bg);
  position: relative;
  margin-top: 14px;
  &:hover .util {
    display: block;
  }
  .util {
    display: none;
    position: absolute;
    right: 30px;
    top: 10px;
    .bg {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-image: url("../../pc/assets/clip.png");
      cursor: pointer;
    }
  }
}
</style>
