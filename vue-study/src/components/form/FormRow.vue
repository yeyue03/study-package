<script>
import { defineComponent, toRefs } from 'vue';
const colObj = {
  // 1: { xs: 24 },
  // 2: { xs: 24, sm: 12 },
  // 3: { xs: 24, sm: 12, xl: 8, xxl: 8 },
  // 4: { xs: 24, sm: 12, xl: 8, xxl: 6 },
  1: { span: 24 },
  2: { span: 12 },
  3: { span: 8 },
  4: { span: 4 },
};

export default defineComponent({
  name: 'FormRow',
  props: {
    col: {
      type: Number,
      default: () => {
        return 3
      }
    }
  },
  setup(props, { slots }) {
    const { col } = toRefs(props);
    return () => (
      <a-row>
        {
          slots.default().map(item => {
            return <a-col {...colObj[col.value]}>{item}</a-col>
          })
        }
      </a-row>
    )
  },
})
</script>
