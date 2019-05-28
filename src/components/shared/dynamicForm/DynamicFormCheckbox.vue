<template>
  <b-form-group
    :description="label"
  >
    <b-form-checkbox
      v-model="inputValue"
      :value="true"
      :unchecked-value="false"
      @change="handleChange"
      :disabled="readonly"
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
      required: false,
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
    value: {
      required: false,
    },
  },
  data() {
    const { example, value } = this;

    return {
      inputValue: (value !== undefined ? value : example),
    };
  },
  methods: {
    handleChange(evt) {
      const { propAddress, onChange } = this;
      onChange(propAddress, evt);
    },
  },
};
</script>