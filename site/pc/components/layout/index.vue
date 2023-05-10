<template>
  <Header></Header>
  <Nav></Nav>
  <div class="layout-container">
    <router-view></router-view>
  </div>
  <div class="keylion-h5-wrap">
    <div class="keylion-h5-right">
      <!-- <iframe
        src="http://localhost:5000"
        frameborder="0"
        class="keylion-h5-iframe"
      ></iframe> -->

      <iframe
        src="../../../mobile.html"
        frameborder="0"
        class="keylion-h5-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./component/header.vue";
import Nav from "./component/nav.vue";
console.log("--123123");
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
