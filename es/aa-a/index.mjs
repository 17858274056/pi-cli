import AaA from "./AaA.mjs";
AaA.install = function(app) {
  app.component(AaA.name, AaA);
};
const _AaAComponent = AaA;
var stdin_default = AaA;
export {
  _AaAComponent,
  stdin_default as default
};
