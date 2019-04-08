<template>
  <div>
    <b-form-group>
      <b-form-radio @change="handleChange" v-model="selected" value="default">Use default security</b-form-radio>
      <b-form-radio @change="handleChange" v-model="selected" value="disabled">Disable security</b-form-radio>
      <b-form-radio @change="handleChange" v-model="selected" value="custom">Use custom security</b-form-radio>
    </b-form-group>
    <div v-if="selected === 'custom'">
      <div
        v-for="(securityOption, index) in securityOptions"
        v-bind:key="index"
      >
        <SecurityOption
          :securityKey="securityOption"
          :formData="formData.filter(item => Object.keys(item).indexOf(securityOption) > -1)"
          :onAddSecurity="handleAddSecurity"
          :onDeleteSecurity="handleDeleteSecurity"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    SecurityOption: () => import('@/components/shared/apiDesigner/abyssTool/SecurityOption'),
  },
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
      } else if (newVal === 'custom') {
        const options = this.securityOptions.map(option => ({ [option]: [] }));
        this.onChange(this.pathArray, options);
      }
    },
    handleAddSecurity(securityKey) {
      const securityOptions = [
        ...this.formData,
        {
          [securityKey]: [],
        },
      ];
      this.onChange(this.pathArray, securityOptions);
    },
    handleDeleteSecurity(securityKey) {
      const securityOptions = this.formData
        .filter(item => Object.keys(item).indexOf(securityKey) === -1);
      this.onChange(this.pathArray, securityOptions);
    },
  },
  mounted() {
    this.setSelected(this.formData);
  },
};
</script>