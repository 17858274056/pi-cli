import {createSSRApp, nextTick} from "vue";
import App from "./App.vue";
import {listenToSyncPath} from "../common/iframe-sync";

import {initRouter} from "./router/index";
export function createApp() {
  const app = createSSRApp(App);
  nextTick(() => {
    initRouter(app.router);
    listenToSyncPath(app.router);
  });
  return {
    app,
  };
}
