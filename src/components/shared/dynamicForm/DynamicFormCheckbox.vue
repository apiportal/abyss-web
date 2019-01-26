<template>
  <b-form-group
    :description="label"
  >
    <b-form-checkbox
      :checked="example"
      :value="true"
      :unchecked-value="false"
    >
      {{ description }}
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    example: {
      type: Boolean,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    readonly: {
      type: Boolean,
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    propAddress: {
      type: Array,
      required: false,
      default() { return []; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
};
</script>