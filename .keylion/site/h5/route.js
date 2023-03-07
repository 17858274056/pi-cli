import {createRouter, createWebHistory} from "vue-router";
import {listenToSyncPath, syncPathToParent} from "../common/iframe-sync";
import H5 from "keylion-site-h5";
let routes = [
  {
    path: "/",
    component: () => import("./components/layout/index.vue"),
  },
  ...H5,
];

export const router = createRouter({
  routes,
  history: createWebHistory(),
});

// watch(router.currentRoute, () => {
//   nextTick(() => syncPathToParent(router));
// });

listenToSyncPath(router);
