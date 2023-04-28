// Component entry, the folder where the file exists will be exposed to the user
import ZnIcon from './ZnIcon.vue'; import type { App } from 'vue'; ZnIcon.install = function(app: App) { app.component(ZnIcon.name, ZnIcon) }; export const _ZnIconComponent = ZnIcon; export default ZnIcon;
