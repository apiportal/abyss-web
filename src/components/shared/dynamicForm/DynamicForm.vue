<template>
  <div>
    <DynamicFormSection
      v-for="(key, index) in keys" v-bind:key="index"
      :title="key"
      :properties="formData[key].properties"
      :required="formData[key].required"
      :type="formData[key].type"
    />
  </div>
</template>

<script>
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
  },
  computed: {
    keys() { return Object.keys(this.formData); },
  },
};
</script>