    import AaA from  './aa-a/index.mjs'

    export * from './aa-a/index.mjs'

    import './aa-a/style/index.mjs'

    const version = '0.1.2'
     function install(app){
        AaA.install && app.use(AaA)
      }
    export {
      version,
      install,
      AaA
    }
    
    export default {
      version,
      install,
      AaA
    }
    