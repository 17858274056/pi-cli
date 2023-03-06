// Component entry, the folder where the file exists will be exposed to the user
import DemoAs from './DemoAs.vue'; import type { App } from 'vue'; DemoAs.install = function(app: App) { app.component(DemoAs.name, DemoAs) }; export const _DemoAsComponent = DemoAs; export default DemoAs;
