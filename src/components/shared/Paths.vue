<template>
  <div>
    <PathEl
      v-for="(pathKey, index) in pathKeys"
      v-bind:key="index"
      :path="pathKey"
      :methods="paths[pathKey]"
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
  },
  data() {
    return {
      pathKeys: Object.keys(this.paths),
    };
  },
};
</script>