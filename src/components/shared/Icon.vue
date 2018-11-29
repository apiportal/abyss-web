<template>
  <font-awesome-icon :icon="['fa', icon]" :spin="spin" />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
      default() { return ''; },
    },
    spin: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
};
</script>
