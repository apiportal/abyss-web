<template>
  <div 
    :class="`open-api-object ${isCollapsed ? 'collapsed' : ''}`"
  >
    <div 
      class="open-api-object-title"
      @click="() => handleToggleCollapse()"
    >
      <span style="float: right;">
        <Icon :icon="(isCollapsed ? 'chevron-down' : 'chevron-right')" />
      </span>
      {{ item }}
    </div>
    <div v-if="isCollapsed" class="open-api-object-container">
      <div v-if="isMapWithRegex">
        <div
          v-for="(key, index) in formDataKeys"
          v-bind:key="index"
          :class="(index < (formDataKeys.length - 1) ? 'mb-3' : '')"
        >
          <OpenApiObject
            :item="key"
            :type="interfaces[type]['{template}'].type"
            :formData="formData[key]"
            :pathArray="[...pathArray, key]"
            :onChange="onChange"
          />
        </div>
      </div>
      <div v-else-if="isMap">
        <div
          v-for="(key, index) in formDataKeys"
          v-bind:key="index"
          :class="(index < (formDataKeys.length - 1) ? 'mb-3' : '')"
        >
          <OpenApiObject
            :item="key"
            :type="type"
            :formData="formData[key]"
            :pathArray="[...pathArray, key]"
            :onChange="onChange"
          />
        </div>
      </div>
      <div v-else-if="isArray">
        <div
          v-for="(formItemData, index) in formData"
          v-bind:key="index"
          :class="(index < (formData.length - 1) ? 'mb-3' : '')"
        >
          <OpenApiObject
            :item="index"
            :type="type"
            :formData="formItemData"
            :pathArray="[...pathArray, index]"
            :onChange="onChange"
          />
        </div>
        <div :style="`margin-top: ${formData.length === 0 ? 0 : 1}rem;`">
          <b-button
            @click="() => addArrayItem(pathArray, formData)"
          >
            New "{{item}}" item
          </b-button>
        </div>
      </div>
      <div v-else>
        <OpenApiObjectForm
          :type="type"
          :formData="formData"
          :pathArray="pathArray"
          :onChange="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Interfaces from '@/assets/openAPI3.0.json';

import Icon from '@/components/shared/Icon';

export default {
  name: 'OpenApiObject',
  props: {
    item: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    formData: {
      type: [Array, Object],
      required: false,
      default() { return {}; },
    },
    pathArray: {
      type: Array,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
    isMapWithRegex: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isMap: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isArray: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isCollapsedInitial: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
  components: {
    OpenApiObjectForm: () => import('@/components/shared/apiDesigner/abyssTool/OpenApiObjectForm'),
    Icon,
  },
  computed: {
    formDataKeys() {
      return Object.keys(this.formData);
    },
  },
  data() {
    return {
      isCollapsed: this.isCollapsedInitial,
      interfaces: Interfaces,
    };
  },
  methods: {
    handleToggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    addArrayItem(pathArray, currentItems) {
      this.onChange(pathArray, [...currentItems, {}]);
    },
  },
};
</script>

<style lang="scss" scoped>
.open-api-object {
  border: 1px solid silver;
  border-radius: .3rem;

  &.collapsed {
    border-left: 4px solid #0088CC;
  }

  .open-api-object-title {
    padding: .5rem;
    cursor: pointer;
  }
}

.open-api-object-container {
  padding: 1rem;
  border-top: 1px solid silver;
}
</style>