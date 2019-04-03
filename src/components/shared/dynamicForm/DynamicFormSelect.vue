<template>
  <b-form-group
    :description="label"
  >
    <label v-if="description">
      {{ description }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <b-form-select
      v-model="inputValue" 
      :options="options"
      :state="state"
      :required="required"
      :disabled="readonly"
      @change="handleChange"
    />
  </b-form-group>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
      default() { return ''; },
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
    options: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    state() {
      const { inputValue, required } = this;

      if (required) {
        return Boolean(inputValue);
      }

      return true;
    },
  },
  watch: {
    value(newValue) {
      if (newValue) {
        this.inputValue = newValue;
      }
    },
  },
  data() {
    const { example, value } = this;

    return {
      inputValue: value || example,
    };
  },
  methods: {
    handleChange(val) {
      const { propAddress, onChange } = this;
      onChange(propAddress, val);
    },
  },
};
</script>