<template>
  <div class="open-api-object">
    <div class="open-api-object-title" @click="() => handleToggleCollapse()">
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
      type: String,
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
      isCollapsed: false,
      interfaces: Interfaces,
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
.open-api-object {
  border: 1px solid silver;
  border-radius: .3rem;

  .open-api-object-title {
    padding: .5rem;
  }
}

.open-api-object-container {
  padding: 1rem;
  border-top: 1px solid silver;
}
</style>