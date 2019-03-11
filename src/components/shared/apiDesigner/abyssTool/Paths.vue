<template>
  <div>
    {{ pathKeys }}
  </div>
</template>

<script>
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
};
</script>
