import { createSSRApp, nextTick } from "vue";
import App from "./App.vue";
import { listenToSyncPath } from "../common/iframe-sync";

import { initRouter } from './router/index'
export function createApp() {
  const app = createSSRApp(App);
  nextTick(() => {
    initRouter((app as any).router)
    listenToSyncPath((app as any).router);
  })
  return {
    app,
  };
}
