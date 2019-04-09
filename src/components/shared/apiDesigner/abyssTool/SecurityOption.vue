<template>
  <div class="security-option-container">
    <div class="security-option-title-container">
      <div class="custom-checkbox">
        <label>
          <input type="checkbox" v-model="checked" @change="handleChange" /> {{ securityKey }}
        </label>
      </div>
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
  border: 1px solid silver;
  border-radius: .3rem;
  margin-top: 1rem;

  .security-option-title-container {
    padding: .25rem .5rem;
  }

  .security-option-content-container {
    padding: .5rem;
    border-top: 1px solid silver;
  }
}
</style>