<template>
  <div class="header">
    <div class="header-icons">
      {{ headTitle }}
    </div>
    <div @click="themeCheck">
      <img
        :src="curTheme === 'dark' ? dark : light"
        alt=""
        class="theme-icon"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch, unref} from "vue";
let headTitle = ref("keylion-docs");
let curTheme = ref(window.localStorage.getItem("theme") || "dark");
import dark from "../../../assets/dark.png";
import light from "../../../assets/light.png";
import {syncThemeToChild} from "../../../../common/iframe-sync";
function themeCheck() {
  if (unref(curTheme) === "dark") {
    curTheme.value = "light";
  } else {
    curTheme.value = "dark";
  }
}

watch(
  curTheme,
  (newVal, oldVal) => {
    window.localStorage.setItem("theme", newVal);
    document.documentElement.classList.remove(`keylion-doc-theme-${oldVal}`);
    document.documentElement.classList.add(`keylion-doc-theme-${newVal}`);
    syncThemeToChild(newVal);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
.header {
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--keylion-doc-header-top-height);
  background-color: var(--keylion-doc-header-bg);
  color: var(--keylion-doc-nav-color);

  width: 100%;
  .header-icons {
    font-size: 26px;
    line-height: 60px;
  }
  .theme-icon {
    width: 30px;
    height: 30px;
  }
}
</style>
