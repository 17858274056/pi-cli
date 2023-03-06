// Component entry, the folder where the file exists will be exposed to the user
import LlAa from './LlAa.vue'; import type { App } from 'vue'; LlAa.install = function(app: App) { app.component(LlAa.name, LlAa) }; export const _LlAaComponent = LlAa; export default LlAa;
