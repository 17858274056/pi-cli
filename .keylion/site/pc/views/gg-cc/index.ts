// Component entry, the folder where the file exists will be exposed to the user
import GgCc from './GgCc'; import type { App } from 'vue'; GgCc.install = function(app: App) { app.component(GgCc.name, GgCc) }; export const _GgCcComponent = GgCc; export default GgCc;
