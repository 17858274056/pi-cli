<template>
  <Header></Header>
  <Nav></Nav>
  <div class="layout-container">
    <router-view></router-view>
  </div>
  <div class="keylion-h5-wrap">
    <div class="keylion-h5-right">
      <iframe
        :src="iframeHref"
        frameborder="0"
        class="keylion-h5-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Header from "./component/header.vue";
import Nav from "./component/nav.vue";
import keylionConfig from "keylion-site-config";
let iframeHref = ref(
  keylionConfig.uniapp
    ? `http://localhost:${keylionConfig.uniapp.port}`
    : "../../../mobile.html"
);
</script>

<style lang="scss" scoped>
.layout-container {
  padding-left: var(--keylion-doc-nav-width);
  padding-right: var(--van-doc-simulator-width);
}

.keylion-h5-right {
  width: 100%;
  height: 100%;
  position: fixed;
  right: 0;
  top: var(--keylion-doc-nav-top);
  background-color: var(--keylion-doc-nav-bg);
  width: var(--van-doc-simulator-width);
  // height: calc(100vh - var(--keylion-doc-nav-top));
  height: 640px;
  border-radius: 20px;
  box-shadow: 0 0 14px 6px var(--site-config-color-shadow);
  @media (max-width: 1100px) {
    right: auto;
    left: 750px;
  }
  .keylion-h5-iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
