import type { App } from 'vue'
import CodeExample from './codeExample.vue'

CodeExample.install = function (app: App) {
    console.log(CodeExample)
    app.component(CodeExample.name, CodeExample)
}

export const _CodeExampleComponent = CodeExample

export default CodeExample
