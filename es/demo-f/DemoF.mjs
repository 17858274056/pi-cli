import { props } from "./props.mjs";
import { defineComponent } from "vue";
import { openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue";
const _hoisted_1 = { class: "demo-f" };
function render(_ctx, _cache) {
  return _openBlock(), _createElementBlock("div", _hoisted_1);
}
var stdin_default = defineComponent({
  render,
  name: "demo-f",
  props,
  setup() {
  }
});
export {
  stdin_default as default,
  render
};
