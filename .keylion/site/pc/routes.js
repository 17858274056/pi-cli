import {createRouter, createWebHistory} from "vue-router";
//@ts-ignore
import documents from "keylion-site-desktop";
let routes = Object.keys(documents).map((i) => {
  return {
    path: `/${i}`,
    component: documents[i],
  };
});

export const route = createRouter({
  routes: [],
  history: createWebHistory(),
});
