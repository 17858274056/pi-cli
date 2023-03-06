import { defineComponent } from 'vue'; import { props } from './props';
import'./ggCc.scss'; export default defineComponent({
name: 'GgCc', props, setup(props, { slots }) { return () => {
return (
<div class="gg-cc">{ slots.default?.() }</div>
) } }, })
