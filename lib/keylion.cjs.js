"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const props = {};
const _hoisted_1 = { class: "aa-a" };
function render(_ctx, _cache) {
  return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, "aaa-aaa-aa-aa");
}
var stdin_default$1 = vue.defineComponent({
  render,
  name: "aa-a",
  props,
  setup() {
  }
});
stdin_default$1.install = function(app) {
  app.component(stdin_default$1.name, stdin_default$1);
};
const _AaAComponent = stdin_default$1;
var stdin_default = stdin_default$1;
const aaA = "";
const AaASfc = "";
const version = "0.1.2";
function install(app) {
  stdin_default.install && app.use(stdin_default);
}
const index_bundle = {
  version,
  install,
  AaA: stdin_default
};
exports.AaA = stdin_default;
exports._AaAComponent = _AaAComponent;
exports.default = index_bundle;
exports.install = install;
exports.version = version;
