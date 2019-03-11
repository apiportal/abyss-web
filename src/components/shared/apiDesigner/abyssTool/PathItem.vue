<template>
  <div>
    <h5>{{ pathKey }}</h5>
    <div v-for="(operationKey, index) in operationKeys" v-bind:key="index">
      <Operation
        :operation="pathItem[operationKey]"
        :operationKey="operationKey"
        :pathKey="pathKey"
      />
    </div>
  </div>
</template>

<script>
import Operation from '@/components/shared/apiDesigner/abyssTool/Operation';

export default {
  props: {
    pathItem: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    pathKey: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    operationKeys() {
      return Object.keys(this.pathItem);
    },
  },
  components: {
    Operation,
  },
};
</script>