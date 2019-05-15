<template>
  <b-form-group
    :description="label"
  >
    <label v-if="description">
      {{ description }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <b-form-textarea
      type="text"
      v-model="inputValue"
      :state="state"
      :placeholder="example"
      :required="required"
      :disabled="readonly"
      @keyup.native="handleKeyup"
      :rows="3"
      :max-rows="6"
    ></b-form-textarea>
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
    debounce: {
      type: Number,
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
    handleKeyup() {
      const { inputValue, propAddress, onChange, debounce } = this;

      if (debounce) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          onChange(propAddress, inputValue);
        }, debounce);
      } else {
        onChange(propAddress, inputValue);
      }
    },
  },
};
</script>