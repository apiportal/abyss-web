<template>
  <tbody class="tbody-collapsible">
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
  },
};
</script>

<style lang="scss" scoped>
.tbody-collapsible {
  & > tr {
    &:first-child {
      td {
        cursor: pointer;
      }
    }

    &.footer {
      > td {
        padding: 0;
      }
    }
  }

  .collapsible-content {
    padding: 1rem;
  }
}
</style>