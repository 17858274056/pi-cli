"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const props$1 = {};
var stdin_default$5 = vue.defineComponent({
  name: "GgCc",
  props: props$1,
  setup(props2, {
    slots
  }) {
    return () => {
      var _a;
      return vue.createVNode("div", {
        "class": "gg-cc"
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
stdin_default$5.install = function(app) {
  app.component(stdin_default$5.name, stdin_default$5);
};
const _GgCcComponent = stdin_default$5;
var stdin_default$4 = stdin_default$5;
var stdin_default$3 = /* @__PURE__ */ vue.defineComponent({
  __name: "LlAa",
  props,
  setup(__props, { expose }) {
    expose();
    const prop = __props;
    const __returned__ = { get prop() {
      return prop;
    }, set prop(v) {
      prop = v;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
stdin_default$3.install = function(app) {
  app.component(stdin_default$3.name, stdin_default$3);
};
const _LlAaComponent = stdin_default$3;
var stdin_default$2 = stdin_default$3;
var stdin_default$1 = /* @__PURE__ */ vue.defineComponent({
  __name: "VvBb",
  props,
  setup(__props, { expose }) {
    expose();
    const prop = __props;
    const __returned__ = { get prop() {
      return prop;
    }, set prop(v) {
      prop = v;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
stdin_default$1.install = function(app) {
  app.component(stdin_default$1.name, stdin_default$1);
};
const _VvBbComponent = stdin_default$1;
var stdin_default = stdin_default$1;
const llAa = "";
const LlAaSfc = "";
const vvBb = "";
const VvBbSfc = "";
const version = "0.0.7";
function install(app) {
  stdin_default$4.install && app.use(stdin_default$4);
  stdin_default$2.install && app.use(stdin_default$2);
  stdin_default.install && app.use(stdin_default);
}
const index_bundle = {
  version,
  install,
  GgCc: stdin_default$4,
  LlAa: stdin_default$2,
  VvBb: stdin_default
};
exports.GgCc = stdin_default$4;
exports.LlAa = stdin_default$2;
exports.VvBb = stdin_default;
exports._GgCcComponent = _GgCcComponent;
exports._LlAaComponent = _LlAaComponent;
exports._VvBbComponent = _VvBbComponent;
exports.default = index_bundle;
exports.install = install;
exports.version = version;
