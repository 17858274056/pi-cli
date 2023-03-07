import {createRouter, createWebHistory} from "vue-router";
//@ts-ignore
import {syncToChild} from "../common/iframe-sync";

import {nextTick, watch} from "vue";

import documents from "keylion-site-desktop";
// let routes = Object.keys(documents).map((i) => {
//   return {
//     path: `/${i}`,
//     component: documents[i],
//   };
// });

export const route = createRouter({
  routes: documents,
  history: createWebHistory(),
});

watch(route.currentRoute, () => {
  syncToChild(route);
});
