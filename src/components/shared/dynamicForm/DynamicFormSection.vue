<template>
  <div class="dynamic-form-section-container">
    <div class="dynamic-form-section-header-container" @click="handleToggleCollapse">
      <span style="float: right">
        <Icon :icon="isCollapsed ? 'arrow-down' : 'arrow-right'" />
      </span>
      <strong>{{ title }}</strong>
    </div>
    <div :class="`dynamic-form-section-content-container ${isCollapsed ? 'd-block' : 'd-none'}`">
      <div v-for="(key, index) in keys" v-bind:key="index">
        <DynamicFormSection
          v-if="properties[key].type === 'object'"
          :title="key"
          :properties="properties[key].properties"
          :required="properties[key].required"
          :type="properties[key].type"
          :propAddress="[ ...propAddress, ...[ 'properties', key] ]"
          :level="(level + 1)"
          :onChange="onChange"
        />
        <DynamicFormGroup 
          v-else
          :title="key"
          :type="properties[key].type"
          :example="properties[key].example"
          :description="properties[key].description"
          :value="properties[key].value"
          :items="properties[key].items"
          :readonly="properties[key]['x-readonly']"
          :required="required.indexOf(key) > -1"
          :propAddress="[ ...propAddress, ...[ 'properties', key] ]"
          :onChange="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';
import DynamicFormGroup from '@/components/shared/dynamicForm/DynamicFormGroup';

export default {
  name: 'DynamicFormSection',
  components: {
    Icon,
    DynamicFormGroup,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    properties: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    required: {
      type: Array,
      required: false,
      default() { return []; },
    },
    type: {
      type: String,
      required: false,
      default() { return 'object'; },
    },
    propAddress: {
      type: Array,
      required: false,
      default() { return []; },
    },
    level: {
      type: Number,
      required: true,
      default() { return 0; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  computed: {
    keys() { return Object.keys(this.properties); },
  },
  data() {
    return {
      isCollapsed: (this.level === 0),
    };
  },
  methods: {
    handleToggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-form-section-container {
  border: 1px solid #e9ecef;
  border-radius: .3rem;
  padding: 1;

  .dynamic-form-section-header-container {
    padding: .5rem 1rem;
    cursor: pointer;
  }

  .dynamic-form-section-content-container {
    padding: 1rem;
    border-top: 1px solid #e9ecef;

    & > div {
      & > .dynamic-form-section-container {
        margin-top: 1rem;
      }

      &:first-child > .dynamic-form-section-container {
        margin-top: 0;
      }
    }
    
  }
}
</style>