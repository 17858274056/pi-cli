import {createApp} from "vue";
import App from "./app.vue";
import {router} from "./route";
import "../common/style/var.scss";
import "../common/style/index.scss";
createApp(App).use(router).mount("#app");
