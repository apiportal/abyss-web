<template>
  <b-form-group 
    :description="label"
  >
    <label>
      {{ description }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <b-form-input
      type="number"
      v-model="inputValue"
      :state="state"
      :placeholder="example.toString()"
      :required="required"
      :disabled="readonly"
      @keyup.native="handleKeyup"
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
  computed: {
    state() {
      const { inputValue, required } = this;

      if (required) {
        return inputValue.length > 0;
      }

      return true;
    },
  },
  data() {
    const { example, value } = this;

    return {
      inputValue: value || example,
    };
  },
  methods: {
    handleKeyup() {
      const { inputValue, propAddress, onChange } = this;
      onChange(propAddress, parseInt(inputValue, 10));
    },
  },
};
</script>