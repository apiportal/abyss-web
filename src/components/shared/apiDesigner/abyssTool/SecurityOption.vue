<template>
  <div class="security-option-container">
    <div class="security-option-title-container">
      <b-form-checkbox v-model="checked" @change.native="handleChange">
        {{ securityKey }}
      </b-form-checkbox>
    </div>
    <div class="security-option-content-container" v-if="formData.length > 0">
      {{ formData[0][securityKey] }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    securityKey: {
      type: String,
      required: true,
    },
    formData: {
      type: [Array, Object],
      required: false,
      default() { return {}; },
    },
    onAddSecurity: {
      type: Function,
      required: true,
    },
    onDeleteSecurity: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      checked: this.formData.length > 0,
    };
  },
  methods: {
    handleChange() {
      if (this.checked) {
        this.onAddSecurity(this.securityKey);
      } else {
        this.onDeleteSecurity(this.securityKey);
      }
    },
  },
};
</script>

<style lang="scss">
.security-option-container {
  border: 1px solid lightgrey;
  margin-top: 1rem;

  .security-option-title-container {
    padding: .5rem 1rem;
  }

  .security-option-content-container {
    padding: .5rem 1rem;
    border-top: 1px solid lightgrey;
  }
}
</style>