import uni from "@dcloudio/vite-plugin-uni";
import { createServer } from "vite";
// import { resolve } from 'path';
// import {
//   SITE_DIR

// } from '../share/constant.js';
// import { uniPagesRoutes } from 'keylion-plugins'
// let uniappDir = resolve(SITE_DIR, "uniapp");
import { getUniappDevConfig } from '../config/vite.config.js'
import { getKeyLionConfig } from '../config/keylion.config.js'

// 不能使用stdin去接 vite config 因为会爆参数长
// (function () {
//   process.stdin.on("data", (result) => {
//     let curResult = JSON.parse(result.toString())
//     curResult.plugins.push((uni as any).default(), uniPagesRoutes()) //bug-- uni必须在这里插入 前面做了process.env的全局变量，应该是修改顺序 问题导致 
//     // process.env.VITE_ROOT_DIR = uniappDir
//     // process.env.UNI_INPUT_DIR = uniappDir
//     try {
//       createServer(curResult).then((server) => {
//         server.listen().then(() => {
//           console.log("success")
//         })
//       })
//     } catch (err) {
//       console.log(err)
//     }
//   })
// })()


// process.env.VITE_ROOT_DIR = uniappDir
// process.env.UNI_INPUT_DIR = uniappDir;

(async () => {
  let devConfig = await getKeyLionConfig()
  let uniconfig = getUniappDevConfig(devConfig);
  uniconfig.plugins?.push((uni as any).default())
  createServer(uniconfig).then((server) => {
    server.listen().then(() => {
      console.log("success")
    })
  }).catch((err) => {
    console.log("error", err)
  })
})()