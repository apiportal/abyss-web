<template>
  <font-awesome-icon :icon="[prefix, icon]" :spin="spin" />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
      default() { return ''; },
    },
    prefix: {
      type: String,
      required: false,
      default() { return 'fa'; },
    },
    spin: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
};
</script>
