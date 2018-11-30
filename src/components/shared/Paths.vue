<template>
  <div>
    <PathEl
      v-for="(pathKey, index) in pathKeys"
      v-bind:key="index"
      :path="pathKey"
      :methods="paths[pathKey]"
      :onMethodChange="onMethodChange"
      :onDescriptionChange="onDescriptionChange"
      :onSummaryChange="onSummaryChange"
    />
  </div>
</template>

<script>
import PathEl from '@/components/shared/PathEl';

export default {
  components: {
    PathEl,
  },
  props: {
    paths: {
      type: Object,
      required: true,
      default() { return {}; },
    },
    onMethodChange: {
      type: Function,
      required: true,
    },
    onDescriptionChange: {
      type: Function,
      required: true,
    },
    onSummaryChange: {
      type: Function,
      required: true,
    },
  },
  computed: {
    pathKeys() {
      return Object.keys(this.paths);
    },
  },
};
</script>