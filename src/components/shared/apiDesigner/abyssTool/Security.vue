<template>
  <div>
    <b-form-group>
      <b-form-radio @change="handleChange" v-model="selected" value="default">Use default security</b-form-radio>
      <b-form-radio @change="handleChange" v-model="selected" value="disabled">Disable security</b-form-radio>
      <b-form-radio @change="handleChange" v-model="selected" value="custom">Use custom security</b-form-radio>
    </b-form-group>
    <div v-if="selected === 'custom'">
      {{ securityOptions }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pathArray: {
      type: Array,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
    formData: {
      type: [Array, Object],
      required: false,
      default() { return {}; },
    },
    securitySchemes: {
      type: Object,
    },
  },
  computed: {
    securityOptions() {
      return Object.keys(this.securitySchemes);
    },
  },
  data() {
    return {
      selected: 'default',
    };
  },
  methods: {
    setSelected(formData) {
      if (formData.empty) {
        this.selected = 'default';
      } else { // eslint-disable-line
        if (formData.length === 0) { // eslint-disable-line
          this.selected = 'disabled';
        } else if (formData.length > 0) {
          this.selected = 'custom';
        }
      }
    },
    handleChange(newVal) {
      if (newVal === 'default') {
        // remove security prop
        this.onChange(this.pathArray, null, 'deleteLastItem');
      } else if (newVal === 'disabled') {
        // set empty array
        this.onChange(this.pathArray, []);
      }
    },
  },
  mounted() {
    this.setSelected(this.formData);
  },
};
</script>