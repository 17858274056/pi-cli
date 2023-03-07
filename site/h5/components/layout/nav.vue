<template>
  <div class="keylion-mobile-nav">
    <ul v-for="h5Doc in mockRoutes" class="keylion-mobile-container">
      <template v-if="h5Doc.items.length > 0">
        <li v-for="doc in h5Doc.items">
          <router-link :to="doc.path" class="keylion-nav-link">
            {{ doc.title }}
          </router-link>
        </li>
      </template>
      <template v-else>
        <div>
          {{ h5Doc.title }}
        </div>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
let mockRoutes = [
  {
    title: "开发指南",
    items: [
      {
        title: "介绍",
        path: "introduce",
      },
      {
        title: "快速上手",
        path: "quickly",
      },
      {
        title: "常见问题",
        path: "Q&A",
      },
    ],
  },
  {
    title: "基础组件",
    items: [
      {
        title: "Button按钮",
        path: "button",
      },
      {
        title: "Cell单元格",
        path: "cell",
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
.keylion-mobile-nav {
  .keylion-mobile-container {
    padding: 0 20px;
    color: var(--keylion-doc-nav-color);

    > li {
      background-color: rgb(var(--keylion-doc-header-bg));
      width: 100%;
      border-radius: 99px;
      line-height: 40px;
    }
  }
}
</style>
