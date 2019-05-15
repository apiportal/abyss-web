<template>
  <tbody :class="`tbody-collapsible ${isCollapsed ? 'tbody-collapsed' : ''} level-${level}`">
    <slot name="main"></slot>
    <slot name="footer" v-if="isCollapsed"></slot>
  </tbody>
</template>

<script>
export default {
  props: {
    isCollapsed: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    level: {
      type: Number,
      required: false,
      default() { return 0; },
    },
  },
  watch: {
    // TODO cover component resize possibility
    isCollapsed(newval) {
      if (newval) {
        setTimeout(function() { // eslint-disable-line
          this.$el.querySelectorAll('.collapsible-content')[0].style.display = 'block';
        }.bind(this), 100);
      }
    },
  },
};
</script>
