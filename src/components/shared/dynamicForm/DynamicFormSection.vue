<template>
  <div>
    <h5>{{ title }}</h5>
    <div v-for="(key, index) in keys" v-bind:key="index">
      <DynamicFormSection
        v-if="properties[key].type === 'object'"
        :title="key"
        :properties="properties[key].properties"
        :required="properties[key].required"
        :type="properties[key].type"
      />
      <DynamicFormGroup 
        v-else
        :title="key"
        :type="properties[key].type"
        :example="properties[key].example"
        :description="properties[key].description"
        :readonly="properties[key]['x-readonly']"
      />
    </div>
  </div>
</template>

<script>
import DynamicFormGroup from '@/components/shared/dynamicForm/DynamicFormGroup';

export default {
  name: 'DynamicFormSection',
  components: {
    DynamicFormGroup,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    properties: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    required: {
      type: Array,
      required: false,
      default() { return []; },
    },
    type: {
      type: String,
      required: false,
      default() { return 'object'; },
    },
  },
  computed: {
    keys() { return Object.keys(this.properties); },
  },
};
</script>