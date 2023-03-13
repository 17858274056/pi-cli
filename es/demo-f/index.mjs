import DemoF from "./DemoF.mjs";
DemoF.install = function(app) {
  app.component(DemoF.name, DemoF);
};
const _DemoFComponent = DemoF;
var stdin_default = DemoF;
export {
  _DemoFComponent,
  stdin_default as default
};
