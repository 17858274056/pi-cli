import { defineComponent as e, openBlock as o, createElementBlock as s } from "vue";
const c = {}, i = { class: "aa-a" };
function l(n, u) {
  return o(), s("div", i, "aaa-aaa-aa-aa");
}
var a = e({
  render: l,
  name: "aa-a",
  props: c,
  setup() {
  }
});
a.install = function(n) {
  n.component(a.name, a);
};
const p = a;
var t = a;
const r = "0.1.2";
function d(n) {
  t.install && n.use(t);
}
const A = {
  version: r,
  install: d,
  AaA: t
};
export {
  t as AaA,
  p as _AaAComponent,
  A as default,
  d as install,
  r as version
};
