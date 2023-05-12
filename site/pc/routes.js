import {createRouter, createWebHistory} from "vue-router";
//@ts-ignore
import {syncToChild} from "../common/iframe-sync";

import {nextTick, watch} from "vue";

import documents from "keylion-site-desktop";

export const route = createRouter({
  routes: documents,
  history: createWebHistory(),
});

watch(route.currentRoute, () => {
  syncToChild(route);
});
