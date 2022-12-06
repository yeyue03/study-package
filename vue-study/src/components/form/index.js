import FormInput from './FormInput.vue';
import FormRow from './FormRow.vue';

export default {
  install: (app) => {
    app.component('FormInput', FormInput);
    app.component('FormRow', FormRow);
  }
}