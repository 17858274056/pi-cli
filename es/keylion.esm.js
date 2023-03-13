import { defineComponent as t, openBlock as s, createElementBlock as c } from "vue";
const a = {}, m = { class: "demo-f" };
function d(e, r) {
  return s(), c("div", m);
}
var n = t({
  render: d,
  name: "demo-f",
  props: a,
  setup() {
  }
});
n.install = function(e) {
  e.component(n.name, n);
};
const u = n;
var o = n;
const i = "0.1.1";
function l(e) {
  o.install && e.use(o);
}
const p = {
  version: i,
  install: l,
  DemoF: o
};
export {
  o as DemoF,
  u as _DemoFComponent,
  p as default,
  l as install,
  i as version
};
