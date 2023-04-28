import { createSSRApp } from "vue";
import Bpp from "./Bpp.vue";
export function createApp() {
  const app = createSSRApp(Bpp);
  return {
    app,
  };
}
