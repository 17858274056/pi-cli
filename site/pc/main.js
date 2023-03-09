import {createApp} from "vue";
import App from "./app.vue";
import codeExample from "../components/code-example";
import {route} from "./routes.js";
import "../common/style/var.scss";
import "../common/style/index.scss";
createApp(App).use(codeExample).use(route).mount("#app");
