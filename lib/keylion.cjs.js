"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const vue = require("vue");
const props = {
  prefix: {
    type: String,
    default: "icon"
  },
  size: {
    type: [Number, String],
    default: 16
  },
  name: {
    type: String,
    required: true
  }
};
const __vue_sfc__ = /* @__PURE__ */ vue.defineComponent({
  __name: "ZnIcon",
  props,
  setup(__props, { expose }) {
    expose();
    const prop = __props;
    const symbolId = vue.computed(() => `#${prop.prefix}-${prop.name}`);
    const getStyle = vue.computed(() => {
      const { size } = prop;
      let s = `${size}`;
      s = `${s.replace("px", "")}px`;
      return {
        width: s,
        height: s
      };
    });
    const __returned__ = { get prop() {
      return prop;
    }, set prop(v) {
      prop = v;
    }, symbolId, getStyle };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["xlink:href"];
function __vue_render__(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock(
    "svg",
    {
      "aria-hidden": "true",
      style: vue.normalizeStyle($setup.getStyle),
      class: "zn-icon"
    },
    [
      vue.createElementVNode("use", { "xlink:href": $setup.symbolId }, null, 8, _hoisted_1)
    ],
    4
    /* STYLE */
  );
}
__vue_sfc__.render = __vue_render__;
var stdin_default$1 = __vue_sfc__;
stdin_default$1.install = function(app) {
  app.component(stdin_default$1.name, stdin_default$1);
};
const _ZnIconComponent = stdin_default$1;
var stdin_default = stdin_default$1;
const znIcon = "";
const ZnIconSfc = "";
const version = "0.1.5";
function install(app) {
  stdin_default.install && app.use(stdin_default);
}
const index_bundle = {
  version,
  install,
  ZnIcon: stdin_default
};
exports.ZnIcon = stdin_default;
exports._ZnIconComponent = _ZnIconComponent;
exports.default = index_bundle;
exports.install = install;
exports.version = version;
