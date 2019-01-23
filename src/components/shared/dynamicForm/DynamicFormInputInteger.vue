<template>
  <b-form-group 
    :label="description"
    :description="label"
  >
    <b-form-input
      type="number"
      :placeholder="label"
      :value="example"
    >
    </b-form-input>
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
      type: [String, Number],
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
  },
};
</script>