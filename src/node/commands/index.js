import {execa} from "execa";
console.log("如");
execa("node", ["src/node/commands/uniapp-dev.js"]).stdout.pipe(process.stdout);
