<template>
  <div>
    <div v-for="(pathKey, index) in pathKeys" v-bind:key="index">
      <PathItem
        :pathItem="paths[pathKey]"
        :pathKey="pathKey"
      />
    </div>
  </div>
</template>

<script>
import PathItem from '@/components/shared/apiDesigner/abyssTool/PathItem';

export default {
  props: {
    paths: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
  computed: {
    pathKeys() {
      return Object.keys(this.paths);
    },
  },
  components: {
    PathItem,
  },
};
</script>
