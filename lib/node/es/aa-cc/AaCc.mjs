import { createVNode as _createVNode } from "vue";
import { defineComponent } from "vue";
import { props } from "./props.mjs";
;
var stdin_default = defineComponent({
  name: "AaCc",
  props,
  setup(props2, {
    slots
  }) {
    return () => {
      var _a;
      return;
      _createVNode("div", {
        "class": "aa-cc"
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
export {
  stdin_default as default
};
