import {createApp} from "vue";
import App from "./app.vue";
import {route} from "./routes.js";
createApp(App).use(route).mount("#app");
