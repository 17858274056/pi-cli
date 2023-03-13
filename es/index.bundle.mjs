    import DemoF from  './demo-f/index.mjs'

    export * from './demo-f/index.mjs'

    import './demo-f/style/index.mjs'

    const version = '0.1.1'
     function install(app){
        DemoF.install && app.use(DemoF)
      }
    export {
      version,
      install,
      DemoF
    }
    
    export default {
      version,
      install,
      DemoF
    }
    