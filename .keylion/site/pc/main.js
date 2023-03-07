import {createApp} from "vue";
import App from "./app.vue";
import {route} from "./routes.js";
import "../common/style/var.scss";
import "../common/style/index.scss";
createApp(App).use(route).mount("#app");
