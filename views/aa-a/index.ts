// Component entry, the folder where the file exists will be exposed to the user
import AaA from './AaA.vue'; import type { App } from 'vue'; AaA.install = function(app: App) { app.component(AaA.name, AaA) }; export const _AaAComponent = AaA; export default AaA;
