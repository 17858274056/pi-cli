// Component entry, the folder where the file exists will be exposed to the user
import DemoF from './DemoF.vue'; import type { App } from 'vue'; DemoF.install = function(app: App) { app.component(DemoF.name, DemoF) }; export const _DemoFComponent = DemoF; export default DemoF;
