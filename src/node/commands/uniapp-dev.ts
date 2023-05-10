// const {spawn} = require("child_process");
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from "path";
import { fileURLToPath } from "url";
console.log(process.cwd());
let __dirname = resolve(fileURLToPath(import.meta.url), "../../../../site");
import { createServer, ViteDevServer } from "vite";
let server: ViteDevServer
async function init() {
  const isRestart = Boolean(server)

  process.env.VITE_ROOT_DIR = resolve(__dirname, "uniapp");
  process.env.UNI_INPUT_DIR = resolve(__dirname, "uniapp");
  server && (server.close())
  server = await createServer({
    plugins: [(uni as any).default()],
    server: {
      port: 5000,
    },
  })

  await server.listen();
  server.printUrls();
}
init();
