<script lang="ts">
import {watch} from "vue";
import {getCurrentTheme} from "../common/iframe-sync";

let theme = getCurrentTheme();

watch(
  theme,
  (newVal, oldVal) => {
    window.localStorage.setItem("theme", newVal);
    document.documentElement.classList.remove(`keylion-doc-theme-${oldVal}`);
    document.documentElement.classList.add(`keylion-doc-theme-${newVal}`);
  },
  {
    immediate: true,
  }
);
</script>
<style></style>
