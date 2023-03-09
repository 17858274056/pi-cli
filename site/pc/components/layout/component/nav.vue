<template>
  <aside class="keylion-nav" :style="style">
    <ul class="keylion-nav-list" v-for="docs in mockRoutes">
      <template v-if="docs.items.length > 0">
        <div class="keylion-nav-docs-h1">
          {{ docs.title }}
        </div>
        <li v-for="doc in docs.items" @click="navClick(doc)">
          <router-link :to="doc.path" class="keylion-nav-link">
            {{ doc.title }}
          </router-link>
        </li>
      </template>
      <template v-else>
        <div cclass="keylion-nav-docs-h1">
          {{ docs.items }}
        </div>
      </template>
    </ul>
  </aside>
</template>

<script setup>
import {ref, computed} from "vue";
import {useRouter} from "vue-router";
import config from "keylion-site-config";
let mockRoutes = config?.routes || [];
let router = useRouter();

let top = ref(0);

let style = computed(() => {
  return {
    top: top.value,
  };
});

function navClick(doc) {}

function isScroll() {
  let {pageYOffset: offset} = window;

  top.value = Math.max(0, 60 - offset);
}

isScroll();
window.addEventListener("scroll", isScroll);
</script>

<style scoped lang="scss">
.keylion-nav {
  padding-left: 24px;
  background-color: var(--keylion-doc-nav-bg);
  position: fixed;
  left: 0;

  min-width: var(--keylion-doc-nav-width);
  max-width: var(--keylion-doc-nav-width);
  color: var(--keylion-doc-nav-color);
  height: calc(100vh - var(--keylion-doc-nav-top));
  overflow-y: auto;
  .keylion-nav-list {
    .keylion-nav-docs-h1 {
      padding-top: 32px;
      font-size: 20px;
      font-weight: bold;
    }
    > li {
      line-height: 32px;
      .keylion-nav-link {
        width: 100%;
        display: inline-block;
        color: inherit;
        text-decoration: none;
      }
    }
  }
}
</style>
