<template>
  <div>
    <DynamicFormSection
      v-for="(key, index) in keys" v-bind:key="index"
      :title="key"
      :properties="formDataEditable[key].properties"
      :required="formDataEditable[key].required"
      :type="formDataEditable[key].type"
      :propAddress="[key]"
      :level="0"
      :onChange="handleChange"
    />
  </div>
</template>

<script>
import Helpers from '@/helpers';
import DynamicFormSection from '@/components/shared/dynamicForm/DynamicFormSection';

export default {
  components: {
    DynamicFormSection,
  },
  props: {
    formData: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    onUpdate: {
      type: Function,
      required: true,
    },
  },
  watch: {
    formData(newVal) {
      this.formDataEditable = newVal;
    },
  },
  computed: {
    keys() {
      return Object.keys(this.formData);
    },
  },
  data() {
    const { formData } = this;

    return {
      formDataEditable: { ...formData },
    };
  },
  methods: {
    handleChange(propAddress, newValue) {
      const { formDataEditable, onUpdate } = this;
      const { objectDeepUpdate } = Helpers;
      let formDataEdited = { ...formDataEditable }; // eslint-disable-line
      objectDeepUpdate([...propAddress, 'value'], newValue, formDataEdited);
      onUpdate(formDataEdited);
    },
  },
};
</script>