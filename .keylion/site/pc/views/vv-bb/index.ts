// Component entry, the folder where the file exists will be exposed to the user
import VvBb from './VvBb.vue'; import type { App } from 'vue'; VvBb.install = function(app: App) { app.component(VvBb.name, VvBb) }; export const _VvBbComponent = VvBb; export default VvBb;
